#[derive(Clone, Copy)]
pub enum Contents {
    ExpData = 1,
    Transformations = 2,
    Addons = 4,
    All = 7,
}

#[derive(Clone, Copy, Debug)]
pub enum Direction {
    X = 0,
    Y = 1,
}
