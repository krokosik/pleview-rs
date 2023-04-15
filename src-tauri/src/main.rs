#![allow(dead_code, unused_variables, unused_imports, unused_mut)]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use log::{warn, LevelFilter};
use std::sync::{Arc, Mutex};
use tauri_plugin_log::LogTarget;

#[cfg(debug_assertions)]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::Webview];

#[cfg(not(debug_assertions))]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::LogDir];

mod axis;
mod cross_section;
mod engine;
mod enums;
mod files;
mod grid_data_2d;
mod menu;

struct EngineState(Arc<Mutex<engine::Engine>>);

fn main() {
    let mut engine = engine::Engine::new();
    if let Err(s) = engine.load_data_from_matrix_file("..\\sample-data\\microwaves_OFF.asc") {
        eprintln!("{}", s);
    }
    let state: EngineState = EngineState(Arc::new(Mutex::new(engine)));

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            get_initial_data,
            update_cross_section
        ])
        .menu(menu::create_menu())
        .on_menu_event(menu::menu_event_handler)
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets(LOG_TARGETS)
                .level_for("tauri", LevelFilter::Info)
                .level_for("hyper", LevelFilter::Info)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_initial_data(
    engine: tauri::State<'_, EngineState>,
) -> Result<(cross_section::CrossSection, Vec<Vec<f64>>), String> {
    let mut engine = engine.0.lock().unwrap();
    let data = engine.get_data();
    if data.is_none() {
        warn!("Retrieving data from engine failed as there is no data loaded.");
        return Err("No data loaded".to_string());
    }
    let z_grid = data.unwrap().get_z_grid();
    let cs = engine.get_current_cross_section();
    Ok((cs.clone(), z_grid))
}

#[tauri::command]
fn update_cross_section(
    direction: usize,
    pixel: usize,
    engine: tauri::State<'_, EngineState>,
) -> Result<Vec<f64>, String> {
    let mut engine = engine.0.lock().unwrap();
    let direction = if direction == 0 {
        enums::Direction::X
    } else {
        enums::Direction::Y
    };
    engine.set_cross_section_by_pixel(direction, pixel, false)?;
    Ok(engine.get_current_cross_section().get_curve(direction)[1].clone())
}
