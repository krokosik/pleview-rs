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

#[derive(Default)]
struct EngineState(Arc<Mutex<engine::Engine>>);

fn main() {
    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
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
        .manage(EngineState::default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
