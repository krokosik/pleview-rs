pub struct Logger {}

impl Logger {
    pub fn new() -> Self {
        Self {}
    }

    pub fn info(message: &str) {
        println!("{}", message);
    }
}
