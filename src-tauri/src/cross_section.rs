#![allow(dead_code)]

use crate::enums::Direction;
use std::cmp::max;

#[derive(Clone)]
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

    pub fn get_width(&self, direction: Direction) -> usize {
        self.width_in_pixels[direction as usize]
    }

    pub fn set_width(&mut self, direction: Direction, width: usize) {
        self.width_in_pixels[direction as usize] = max(1, width);
    }
}
