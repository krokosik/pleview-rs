#![allow(dead_code)]

use crate::axis::AxisConfiguration;
use crate::cross_section::CrossSection;
use crate::enums::Direction;
use crate::grid_data_2d::GridData2D;

use std::cmp::{max, min};

pub trait EngineAPI {
    fn emit_data_changed(&self, data: &GridData2D);
    fn emit_cross_section_changed(&self, cross_section: &CrossSection);
    fn emit_central_pixel_changed(&self, direction: Direction, central_pixel: usize);
    fn emit_position_changed(
        &self,
        direction: Direction,
        position: f64,
        range_lower: f64,
        range_upper: f64,
    );
    fn emit_curve_changed(&self, direction: Direction, curve: &[[f64; 2]]);

    fn set_data(&self, listener: Box<dyn Fn(&GridData2D)>);
    fn set_cross_section_by_pixel(&self, listener: Box<dyn Fn(Direction, usize, bool)>);
    fn set_cross_section_by_value(&self, listener: Box<dyn Fn(Direction, f64, bool)>);
    fn set_cross_section_width(&self, listener: Box<dyn Fn(Direction, AxisConfiguration, bool)>);
    fn set_axis_configuration(&self, listener: Box<dyn Fn(&AxisConfiguration)>);
}

pub struct Engine<'a, E: EngineAPI> {
    axis_configurations: [AxisConfiguration<'a>; 2],
    cross_section: CrossSection,
    data: Option<GridData2D>,
    original_data: Option<&'a GridData2D>,
    api: E,
}

impl<'a, E: EngineAPI> Engine<'a, E> {
    pub fn new(api: E) -> Self {
        let mut result = Self {
            axis_configurations: [AxisConfiguration::new(), AxisConfiguration::new()],
            cross_section: CrossSection::new(),
            data: None,
            original_data: None,
            api,
        };

        result.prepare_data().unwrap();

        result
    }

    pub fn set_axis_configuration(
        &mut self,
        direction: &Direction,
        axis_configuration: AxisConfiguration<'a>,
    ) -> Result<(), String> {
        let axis_index = *direction as usize;
        self.axis_configurations[axis_index] = axis_configuration;

        if self.data.is_none() {
            return Ok(());
        }

        match direction {
            Direction::X => {
                let args = self.axis_configurations[axis_index]
                    .values(self.original_data.unwrap().x_values());
                self.data.as_mut().unwrap().set_x_values(args);
            }
            Direction::Y => {
                let args = self.axis_configurations[axis_index]
                    .values(self.original_data.unwrap().x_values());
                self.data.as_mut().unwrap().set_x_values(args);
            }
        }

        self.broadcast_changes();
        Ok(())
    }

    pub fn set_cross_section_by_pixel(
        &mut self,
        direction: Direction,
        central_pixel: usize,
        force_signal: bool,
    ) -> Result<(), String> {
        if central_pixel != self.cross_section.get_central_pixel(direction) || force_signal {
            self.cross_section
                .set_central_pixel(direction, central_pixel)?;
        }
        Ok(())
    }

    pub fn set_cross_section_by_position(
        &mut self,
        direction: Direction,
        position: f64,
        force_signal: bool,
    ) -> Result<(), String> {
        if self.data.is_none() {
            return Err("No data set".to_owned());
        }

        let positions = match direction {
            Direction::X => self.data.as_ref().unwrap().x_values(),
            Direction::Y => self.data.as_ref().unwrap().y_values(),
        };

        let central_pixel = positions
            .binary_search_by(|val| val.partial_cmp(&position).unwrap())
            .unwrap_or_else(|e| e);

        self.set_cross_section_by_pixel(direction, central_pixel, force_signal)
    }

    pub fn set_data(&mut self, data: &'a GridData2D) -> Result<(), String> {
        // TODO refactor this once I understand Rust smart pointers better
        self.original_data = Some(data);
        self.data = Some((*data).clone());

        self.cross_section.reset();

        self.broadcast_changes();
        Ok(())
    }

    pub fn prepare_data(&mut self) -> Result<(), String> {
        self.data = self.original_data.map(|data| (*data).clone());

        let args = self.axis_configurations[Direction::X as usize]
            .values(self.original_data.unwrap().x_values());
        self.data.as_mut().unwrap().set_x_values(args);

        let args = self.axis_configurations[Direction::Y as usize]
            .values(self.original_data.unwrap().y_values());
        self.data.as_mut().unwrap().set_y_values(args);

        self.broadcast_changes();
        Ok(())
    }

    pub fn set_cross_section_width(&mut self, direction: Direction, width: usize) {
        self.cross_section.set_width(direction, width);
        self.broadcast_cross_section_changed(Direction::X);
        self.broadcast_cross_section_changed(Direction::Y);
    }

    fn broadcast_changes(&mut self) {
        self.api.emit_data_changed(self.data.as_ref().unwrap());
        self.broadcast_cross_section_changed(Direction::X);
        self.broadcast_cross_section_changed(Direction::Y);
    }

    fn broadcast_cross_section_changed(&mut self, direction: Direction) {
        self.cross_section
            .set_curve(direction, self.calculate_cross_section(direction));

        let horizontal = match direction {
            Direction::X => self.data.as_ref().unwrap().x_values(),
            Direction::Y => self.data.as_ref().unwrap().y_values(),
        };

        self.cross_section.update_ranges(direction, horizontal);

        self.api.emit_cross_section_changed(&self.cross_section);
        self.api
            .emit_central_pixel_changed(direction, self.cross_section.get_central_pixel(direction));
        self.api.emit_position_changed(
            direction,
            self.cross_section.get_position(direction),
            self.cross_section.get_range_lower(direction),
            self.cross_section.get_range_upper(direction),
        );
        self.api
            .emit_curve_changed(direction, self.cross_section.get_curve(direction));
    }

    pub fn get_data(&self) -> Option<&GridData2D> {
        self.data.as_ref()
    }

    pub fn get_current_cross_section(&self) -> &CrossSection {
        &self.cross_section
    }

    pub fn get_cross_section_point(&self) -> Option<[f64; 2]> {
        self.data.as_ref()?;

        Some([
            self.data.as_ref().unwrap().x_values()
                [self.cross_section.get_central_pixel(Direction::X)],
            self.data.as_ref().unwrap().y_values()
                [self.cross_section.get_central_pixel(Direction::Y)],
        ])
    }

    pub fn calculate_cross_section(&self, direction: Direction) -> Vec<[f64; 2]> {
        if self.data.is_none() {
            return vec![];
        }

        let data = self.data.as_ref().unwrap();

        if data.is_empty()
            || match direction {
                Direction::X => data.cols(),
                Direction::Y => data.rows(),
            } <= self.cross_section.get_width(direction)
        {
            return vec![];
        }

        let (xs, ys) = match direction {
            Direction::X => (data.x_values(), data.y_values()),
            Direction::Y => (data.y_values(), data.x_values()),
        };

        let width = self.cross_section.get_width(direction);
        let offset = width / 2;

        let result = ys
            .iter()
            .enumerate()
            .map(|(i, y)| {
                let mut point = [*y, 0.0];
                for j in 0..width {
                    let pos = self.cross_section.get_central_pixel(direction) - offset + j;
                    let z = match direction {
                        Direction::X => data.get_value_bounded(pos, i),
                        Direction::Y => data.get_value_bounded(i, pos),
                    };
                    point[1] += z.unwrap();
                }
                point
            })
            .collect();

        let pos0 = max(self.cross_section.get_central_pixel(direction) - offset, 0);
        let pos1 = min(
            self.cross_section.get_central_pixel(direction) + offset - 1,
            xs.len() - 1,
        );

        if pos1 < pos0 {
            return result;
        }

        let factor = width as f64 / (pos1 - pos0 + 1) as f64;

        result
            .iter()
            .enumerate()
            .map(|(i, [first, _])| match direction {
                Direction::X => [
                    *first,
                    data.sum_in_index_range((pos0, pos1), (i, i)) * factor,
                ],
                Direction::Y => [
                    *first,
                    data.sum_in_index_range((i, i), (pos0, pos1)) * factor,
                ],
            })
            .collect()
    }
}
