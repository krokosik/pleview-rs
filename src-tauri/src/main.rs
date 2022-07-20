#![allow(dead_code, unused_variables, unused_imports, unused_mut)]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod axis;
mod cross_section;
mod engine;
mod enums;
mod files;
mod grid_data_2d;
mod logger;
mod menu;

fn main() {
    // let mut engine = engine::Engine::new();

    // engine.set_data(&data).unwrap();

    // println!("{:?}", engine.get_data());

    let (xs, ys, values) = files::read_two_column_ascii("../test.txt").unwrap();
    let data = grid_data_2d::GridData2D::from(&xs, &ys, &values).unwrap();

    tauri::Builder::default()
        .menu(menu::create_menu())
        .on_menu_event(menu::menu_event_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
