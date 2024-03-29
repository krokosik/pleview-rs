use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

pub fn create_menu() -> Menu {
    Menu::new()
        .add_submenu(create_file_submenu())
        .add_submenu(create_edit_submenu())
        .add_submenu(create_help_submenu())
}

pub fn menu_event_handler(event: WindowMenuEvent) {
    let _window = event.window();

    match event.menu_item_id() {
        "open" => println!("Open"),
        "save" => println!("Save"),
        "save_as" => println!("Save as"),
        _ => {}
    };
}

fn create_file_submenu() -> Submenu {
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let save = CustomMenuItem::new("save".to_string(), "Save");
    let save_as = CustomMenuItem::new("save_as".to_string(), "Save as");

    let print = CustomMenuItem::new("print_map".to_string(), "Print map");

    Submenu::new(
        "File",
        Menu::new()
            .add_item(open)
            .add_item(save)
            .add_item(save_as)
            .add_native_item(MenuItem::Separator)
            .add_submenu(create_import_submenu())
            .add_submenu(create_export_submenu())
            .add_native_item(MenuItem::Separator)
            .add_item(print)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    )
}

fn create_import_submenu() -> Submenu {
    let ascii = CustomMenuItem::new("import_ascii".to_string(), "ASCII");
    let itex = CustomMenuItem::new("import_itex".to_string(), "ITEX");

    Submenu::new("Import", Menu::new().add_item(ascii).add_item(itex))
}

fn create_export_submenu() -> Submenu {
    let ascii = CustomMenuItem::new("export_ascii".to_string(), "ASCII");
    let image = CustomMenuItem::new("export_image".to_string(), "Image");

    Submenu::new("Export", Menu::new().add_item(ascii).add_item(image))
}

fn create_edit_submenu() -> Submenu {
    let load_plugin = CustomMenuItem::new("load_plugin".to_string(), "Load plugin");
    let active_plugin_dialog =
        CustomMenuItem::new("active_plugin_dialog".to_string(), "Active plugin dialog");
    let transformations_dialog = CustomMenuItem::new(
        "transformations_dialog".to_string(),
        "Transformations dialog",
    );

    Submenu::new(
        "Edit",
        Menu::new()
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Separator)
            .add_item(load_plugin)
            .add_item(active_plugin_dialog)
            .add_item(transformations_dialog),
    )
}

fn create_help_submenu() -> Submenu {
    let about = CustomMenuItem::new("about".to_string(), "About");

    Submenu::new("Help", Menu::new().add_item(about))
}
