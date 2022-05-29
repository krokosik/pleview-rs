#![allow(dead_code)]

use rsc::{
    computer::Computer,
    lexer::{tokenize, Token},
    parser::{parse, Expr},
};

#[derive(Clone)]
pub enum AxisType {
    FromFile,
    Natural,
}

#[derive(Clone)]
pub struct AxisConfiguration<'a> {
    pub axis_type: AxisType,
    use_transform: bool,
    transform: Computer<'a, f64>,
    expression: Expr<f64>,
}

const DEFAULT_VAR_VALUE: f64 = 1.;
const DEFAULT_VAR_NAMES: [&str; 3] = ["x", "y", "t"];

fn default_vars() -> [(String, (f64, bool)); 3] {
    DEFAULT_VAR_NAMES.map(|var| (String::from(var), (DEFAULT_VAR_VALUE, false)))
}

fn get_default_tokens() -> Vec<Token<f64>> {
    tokenize("t", true).unwrap()
}

fn get_default_expression() -> Expr<f64> {
    parse(&get_default_tokens()).unwrap()
}

impl AxisConfiguration<'_> {
    pub fn new() -> Self {
        let mut computer = Computer::<f64>::default();

        // The boolean stands for is_constant
        computer.variables.extend(default_vars());

        Self {
            axis_type: AxisType::FromFile,
            use_transform: false,
            transform: computer,
            expression: get_default_expression(),
        }
    }

    pub fn set_transform(&mut self, transform: &str) {
        let tokens: Vec<Token<f64>> = tokenize(transform, true).unwrap_or_else(|_| get_default_tokens());

        let ast: Expr<f64> = parse(&tokens).unwrap_or_else(|_| get_default_expression());

        self.expression = ast;
    }

    pub fn values<'a>(&'a mut self, file_values: &'a Vec<f64>) -> Vec<f64> {
        let t_values: Vec<f64> = match self.axis_type {
            AxisType::FromFile => file_values.clone(),
            AxisType::Natural => (0..file_values.len())
                .map(|n| n as f64)
                .collect::<Vec<f64>>(),
        };

        let result: Vec<f64> = t_values
            .iter()
            .enumerate()
            .map(|(index, t)| -> f64 {
                if self.use_transform {
                    self.transform
                        .variables
                        .insert("t".to_string(), (*t, false))
                        .unwrap();

                    self.transform
                        .compute(&self.expression)
                        .unwrap_or_else(|_| *file_values.get(index).unwrap())
                } else {
                    *t
                }
            })
            .collect();

        if result.iter().any(|t| t.is_nan() || t.is_infinite()) {
            file_values.clone()
        } else {
            result
        }
    }
}
