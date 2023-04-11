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
    let mut engine = engine::Engine::new();
    if let Err(s) = engine.load_data_from_matrix_file("..\\sample-data\\microwaves_OFF.asc") {
        eprintln!("{}", s);
    }

    tauri::Builder::default()
        .menu(menu::create_menu())
        .on_menu_event(menu::menu_event_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
