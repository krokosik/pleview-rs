#![allow(dead_code)]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod axis;
mod cross_section;
mod engine;
mod enums;
mod grid_data_2d;
mod menu;

fn main() {
    tauri::Builder::default()
        .menu(menu::create_menu())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("Hello, world!");
}
