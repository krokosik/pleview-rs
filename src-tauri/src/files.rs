use std::fs::{self, File};
use std::io::{BufRead, BufReader};
use std::num::ParseFloatError;

type Raw2dData = (Vec<f64>, Vec<f64>, Vec<f64>);

pub fn read_two_column_ascii(path: &str) -> Result<Raw2dData, String> {
    let file = File::open(path).map_err(|_| "Could not open file")?;

    let file = File::open(path).map_err(|err| "Could not open file")?;
    let reader = BufReader::new(file);

    let mut is_reading_spectrum = false;

    let mut spectra_count = 0.;
    let mut xs = vec![];
    let mut ys = vec![];
    let mut values = vec![];

    for (line_count, line) in reader.lines().enumerate() {
        let line = line.map_err(|err| "Could not read line")?;
        let line = line.trim();

        if line.is_empty() {
            continue;
        }

        match line
            .split_whitespace()
            .map(|s| s.parse::<f64>())
            .collect::<Result<Vec<f64>, ParseFloatError>>()
        {
            Ok(vec) => {
                if vec.len() != 2 {
                    return Err(format!("Error on line {}: expected two values", line_count));
                }
                if !is_reading_spectrum {
                    is_reading_spectrum = true;
                    ys.push(spectra_count);
                    spectra_count += 1.;
                }
                if ys.len() == 1 {
                    xs.push(vec[0]);
                }
                values.push(vec[1]);
            }
            Err(err) => {
                is_reading_spectrum = false;
            }
        }
    }

    if xs.len() * ys.len() != values.len() {
        return Err("The spectra are not of identical length".to_owned());
    }

    if values.len() > 1e8 as usize {
        return Err("Total number of pixels exceeds 10^8".to_owned());
    }

    Ok((xs, ys, values))
}
