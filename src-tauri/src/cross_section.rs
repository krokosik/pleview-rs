#![allow(dead_code)]

use crate::enums::Direction;
use std::cmp::max;

#[derive(Clone, Debug)]
pub struct CrossSection {
    central_pixels: [usize; 2],
    width_in_pixels: [usize; 2],
    position: [f64; 2],
    range_lower: [f64; 2],
    range_upper: [f64; 2],
    curve: [Vec<[f64; 2]>; 2],
}

impl CrossSection {
    pub fn new() -> Self {
        Self {
            central_pixels: [0, 0],
            width_in_pixels: [1, 1],
            position: [0.0, 0.0],
            range_lower: [0.0, 0.0],
            range_upper: [0.0, 0.0],
            curve: [vec![], vec![]],
        }
    }

    pub fn reset(&mut self) {
        for i in 0..1 {
            self.central_pixels[i] = 0;
            self.width_in_pixels[i] = 1;
            self.position[i] = 0.0;
            self.range_lower[i] = 0.0;
            self.range_upper[i] = 0.0;
            self.curve[i].clear();
        }
    }

    pub fn set_central_pixel(&mut self, direction: Direction, pixel: usize) -> Result<(), String> {
        let direction = direction as usize;

        if pixel > self.width_in_pixels[direction] {
            return Err("Central pixel out of range".to_owned());
        }
        self.central_pixels[direction] = pixel;

        Ok(())
    }

    pub fn get_central_pixel(&self, direction: Direction) -> usize {
        self.central_pixels[direction as usize]
    }

    pub fn get_position(&self, direction: Direction) -> f64 {
        self.position[direction as usize]
    }

    pub fn get_range_lower(&self, direction: Direction) -> f64 {
        self.range_lower[direction as usize]
    }

    pub fn get_range_upper(&self, direction: Direction) -> f64 {
        self.range_upper[direction as usize]
    }

    pub fn get_width(&self, direction: Direction) -> usize {
        self.width_in_pixels[direction as usize]
    }

    pub fn get_curve(&self, direction: Direction) -> &Vec<[f64; 2]> {
        &self.curve[direction as usize]
    }

    pub fn set_width(&mut self, direction: Direction, width: usize) {
        self.width_in_pixels[direction as usize] = max(1, width);
    }

    pub fn set_curve(&mut self, direction: Direction, curve: Vec<[f64; 2]>) {
        self.curve[direction as usize] = curve;
    }

    pub fn update_ranges(&mut self, direction: Direction, horizontal: &[f64]) {
        if horizontal.is_empty() {
            return;
        }

        let width = self.get_width(direction);

        let tmp1 = horizontal
            .get((self.get_central_pixel(direction) - width / 2).saturating_sub(1))
            .unwrap_or_else(|| horizontal.first().unwrap());
        let tmp2 = horizontal
            .get(self.get_central_pixel(direction) - width / 2)
            .unwrap_or_else(|| horizontal.first().unwrap());

        self.range_lower[direction as usize] = (tmp1 + tmp2) / 2.;

        let tmp1 = horizontal
            .get((self.get_central_pixel(direction) + width / 2).saturating_sub(1))
            .unwrap_or_else(|| horizontal.first().unwrap());
        let tmp2 = horizontal
            .get(self.get_central_pixel(direction) + width / 2)
            .unwrap_or_else(|| horizontal.first().unwrap());

        self.range_upper[direction as usize] = (tmp1 + tmp2) / 2.;
    }
}
