#![allow(dead_code)]

pub struct DimensionData {
    vec: Vec<f64>,
    pub min: f64,
    pub max: f64,
}

impl DimensionData {
    fn new() -> Self {
        DimensionData {
            vec: Vec::new(),
            min: 0.0,
            max: 0.0,
        }
    }

    pub fn from(vec: &Vec<f64>) -> Self {
        let mut data = DimensionData::new();
        data.vec = vec.clone();
        data.find_limits();
        data
    }

    fn find_limits(&mut self) {
        if self.vec.is_empty() {
            self.min = 0.0;
            self.max = 0.0;
        } else {
            self.min = self.vec[0];
            self.max = self.vec[0];
            for v in self.vec.iter() {
                if *v < self.min {
                    self.min = *v;
                }
                if *v > self.max {
                    self.max = *v;
                }
            }
        }
    }
}

pub struct GridData2D {
    pub x_data: DimensionData,
    pub y_data: DimensionData,
    pub values_data: DimensionData,
    cumulative: Vec<f64>,
}

impl GridData2D {
    fn new() -> Self {
        Self {
            x_data: DimensionData::new(),
            y_data: DimensionData::new(),
            values_data: DimensionData::new(),
            cumulative: Vec::new(),
        }
    }

    fn from(xs: &Vec<f64>, ys: &Vec<f64>, values: &Vec<f64>) -> Result<Self, String> {
        if xs.len() * ys.len() != values.len() {
            return Err(
                "The number of values must be equal to the number of x times y values".to_owned(),
            );
        }

        let mut grid = Self {
            x_data: DimensionData::from(xs),
            y_data: DimensionData::from(ys),
            values_data: DimensionData::from(values),
            cumulative: Vec::new(),
        };

        grid.calculate_cumulative();

        Ok(grid)
    }

    fn data_changed(&mut self) {
        // TODO: Rewritten directly, potential for refactor
        let mut already_sorted = true;

        let mut new_x = Vec::with_capacity(self.x_data.vec.len());
        let mut new_y = Vec::with_capacity(self.y_data.vec.len());

        for (i, x) in self.x_data.vec.iter().enumerate() {
            new_x.push((*x, i));
        }
        for (i, y) in self.y_data.vec.iter().enumerate() {
            new_y.push((*y, i));
        }

        new_x.sort_unstable_by(|a, b| a.0.partial_cmp(&b.0).unwrap());
        new_y.sort_unstable_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

        for (i, &(_, old_i)) in new_x.iter().enumerate() {
            if i != old_i {
                already_sorted = false;
                break;
            }
        }
        for (i, &(_, old_i)) in new_y.iter().enumerate() {
            if i != old_i {
                already_sorted = false;
                break;
            }
        }

        if !already_sorted {
            self.x_data.vec = new_x.iter().map(|x| x.0).collect();
            self.y_data.vec = new_y.iter().map(|y| y.0).collect();

            let mut new_values = Vec::with_capacity(self.values_data.vec.len());

            for x in &self.x_data.vec {
                for y in &self.y_data.vec {
                    new_values.push(x * y);
                }
            }

            self.values_data.vec = new_values;
        }

        self.find_limits();
        self.calculate_cumulative();
    }

    fn find_limits(&mut self) {
        self.x_data.find_limits();
        self.y_data.find_limits();
        self.values_data.find_limits();
    }

    fn calculate_cumulative(&mut self) {
        self.cumulative = self.values_data.vec.clone();

        for i in 1..self.x_data.vec.len() {
            for j in 1..self.y_data.vec.len() {
                self.cumulative[i + j * self.x_data.vec.len()] += self.cumulative
                    [i + (j - 1) * self.x_data.vec.len()]
                    + self.cumulative[(i - 1) + j * self.x_data.vec.len()]
                    - self.cumulative[(i - 1) + (j - 1) * self.x_data.vec.len()];
            }
        }
    }
}
