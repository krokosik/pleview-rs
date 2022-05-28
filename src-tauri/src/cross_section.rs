#![allow(dead_code)]

#[derive(Clone)]
pub struct CrossSection {
    pub central_pixels: [u32; 2],
    pub width_in_pixels: [u32; 2],
    pub position: [f64; 2],
    pub range_lower: [f64; 2],
    pub range_upper: [f64; 2],
    pub curve: [Vec<[f64; 2]>; 2],
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
}
