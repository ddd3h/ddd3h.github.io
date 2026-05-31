---
title: "Building Real-Time Telemetry for Stratospheric Balloons"
description: "How we designed and built a GUI-based real-time telemetry system for the ANCO and soffione stratospheric balloon projects."
date: 2024-11-10
lang: en
tags: ["rocket engineering", "telemetry", "balloon", "Python", "IoT"]
---

## The Challenge

When you send a payload to 30km altitude in a stratospheric balloon, you can't physically touch it. You need to know in real time what's happening — temperature, pressure, GPS coordinates, sensor readings — all transmitted back to the ground while the balloon is drifting over who-knows-where.

This is the core challenge we tackled in the **ANCO-project** and **soffione-project**.

## The System Design

Our telemetry system has three main components:

1. **Onboard module**: Raspberry Pi Zero with sensors (BMP280 for pressure/altitude, GPS module, IMU). Data serialized and transmitted via LoRa radio.
2. **Ground station**: LoRa receiver connected to a laptop.
3. **GUI dashboard**: Python + PyQt5 real-time dashboard displaying live sensor data, GPS track on a map, and altitude graph.

## Key Technical Decisions

**LoRa over 4G**: We chose LoRa (Long Range) radio because it works at altitude where cellular coverage is unreliable. Trade-off: lower bandwidth, but we don't need high bandwidth for telemetry.

**Python for the GUI**: Fast prototyping was essential. PyQt5 gave us a native-feeling GUI with `matplotlib` embedded for live plots.

**Data logging**: All data is simultaneously logged to CSV so we have a complete record even if the GUI crashes.

## Lessons Learned

- Always add a heartbeat indicator — knowing the link is alive is as important as the data itself.
- GPS cold starts at altitude can be slow. Initialize the GPS before launch.
- Temperature extremes at stratospheric altitudes (-50°C) will kill lithium batteries. Thermal insulation is not optional.

## Results

Both missions were successful. The soffione project achieved a maximum altitude of approximately 27km and the telemetry system maintained contact throughout the flight.
