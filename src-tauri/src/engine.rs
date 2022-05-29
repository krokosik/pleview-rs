#![allow(dead_code)]

use crate::axis::AxisConfiguration;
use crate::cross_section::CrossSection;
use crate::enums::Direction;
use crate::grid_data_2d::GridData2D;

pub struct Engine<'a> {
    axis_configurations: [AxisConfiguration<'a>; 2],
    cross_section: CrossSection,
    data: Option<&'a GridData2D>,
    original_data: Option<&'a GridData2D>,
}

impl<'a> Engine<'a> {
    pub fn new() -> Self {
        Self {
            axis_configurations: [AxisConfiguration::new(), AxisConfiguration::new()],
            cross_section: CrossSection::new(),
            data: None,
            original_data: None,
        }
    }

    pub fn set_axis_configuration(
        &mut self,
        direction: &Direction,
        axis_configuration: AxisConfiguration<'a>,
    ) -> Result<(), String> {
        let direction = *direction as usize;
        self.axis_configurations[direction] = axis_configuration;
        Ok(())
    }

    pub fn set_cross_section_by_pixel(
        &mut self,
        direction: &Direction,
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
        direction: &Direction,
        position: f64,
        force_signal: bool,
    ) -> Result<(), String> {
        if self.data.is_none() {
            return Err("No data set".to_owned());
        }

        let positions = match *direction {
            Direction::X => self.data.unwrap().x_values(),
            Direction::Y => self.data.unwrap().y_values(),
        };

        let central_pixel = positions
            .binary_search_by(|val| val.partial_cmp(&position).unwrap())
            .unwrap_or_else(|e| e);

        self.set_cross_section_by_pixel(direction, central_pixel, force_signal)
    }
}
