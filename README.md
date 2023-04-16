# PLEview

PLEview is an open-source project to assist in analysis of experimental data. The original program was written in C++ and Qt by [@tkazimierczuk-fuw](https://www.github.com/tkazimierczuk-fuw) and can be found [here](https://github.com/tkazimierczuk-fuw/pleview).

A decision was reached to try rewriting the app using Tauri, as a side project to learn new technologies and modernize the app itself. It is still a work in progress and is currently not usable.

## Development

### Get started

- Install Node.js
- Install Rust
- Follow the [Tauri setup guide](https://tauri.studio/en/docs/getting-started/intro)
- Run `npm install`

### Commands

- `tauri build`: Build
- `tauri dev`: Run dev server

### Old Pleview

The `pleview-old` contains the binaries for latest legacy PLEview versions. Version `0.17` is the last version for which the source code exists and is provided as a Windows installer.

The `pre-0.19` zip file on the other hand is the latest version that was created, but the source code was lost. It should be unpacked into the `Program Files (x86)` without installation.

There is also a [web page](https://www.fuw.edu.pl/~tkaz/narzedzia/) with tasks to be performed using PLEview (in Polish), which includes some examples use cases as well as test data, that can also be found in the `sample-data` directory.