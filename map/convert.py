#!/usr/bin/env python3

import os
import sys
import json

def _extract_seprom_platform(rom: dict) -> str:
    return rom["name"].split(" ")[0]

def _extract_seprom_rev(rom: dict) -> str:
    return rom["name"].split(" ")[1]

def _extract_securerom_platform(rom: dict) -> str:
    return rom["name"].split(" ")[2]

SOC2CHIP = {
    "Alcatraz" : "s5l8960xsi",
    "Fiji" : "t7000si",
    "Capri" : "t7001si",
    "Maui" : "s8000si",
    "Malta" : "s8003si",
    "Elba" : "s8001si",
    "M8" : "t8002si",
    "Cayman" : "t8010si",
    "Myst" : "t8011si",
    "M8P" : "t8004si",
    "Skye" : "t8015si",
    "Gibraltar" : "t8012si",
    "Cyprus" : "t8020si",
    "M9" : "t8006si",
    "Aruba" : "t8027si",
    "Cebu" : "t8030si",
    "Sicily" : "t8101si",
    "Tonga" : "t8103si",
    "Turks" : "t8301si",
    "Ellis" : "t8110si",
    "Staten" : "t8112si",
    "Crete" : "t8120si",
    "Coll" : "t8130si",
    "Palma" : "t6031si",
    "Donan" : "t8132si"
}

def convert_map(map: dict) -> dict:
    socs = {}
    for rom in map["aps"]["roms"]:
        platform = _extract_securerom_platform(rom)

        if not socs.get(platform):
            socs[platform] = {}
            socs[platform]["title"] = "TODO"
            socs[platform]["subtitle"] = platform
            socs[platform]["devices"] = []
            socs[platform]["picture"] = rom["picture"]
            socs[platform]["roms"] = [[]]

        socs[platform]["roms"][0].append({
            "title" : os.path.basename(rom["link"]),
            "link" : rom["link"],
            "revisions" : [{"name" : "TODO", "rev" : "TODO"}]
        })

    for rom in map["seps"]["roms"]:
        soc_platform = _extract_seprom_platform(rom)
        platform = SOC2CHIP[soc_platform]

        if len(socs[platform]["roms"]) < 2:
            socs[platform]["roms"].append([])

        sep_sect = socs[platform]["roms"][1]

        sep_sect.append({
            "title" : os.path.basename(rom["link"]),
            "link" : rom["link"],
            "revisions" : [{"name" : _extract_seprom_rev(rom), "rev" : "TODO"}]
        })

    return {
        "darwin" : list(socs.values())
    }


def main():
    if len(sys.argv) != 3:
        print("%s <in> <out>" % sys.argv[0])
        exit(-1)

    _, inp, out = sys.argv

    with open(inp, "r") as f:
        map_raw = json.load(f)

    converted = convert_map(map_raw)

    with open(out, "w") as f:
        json.dump(converted, f, indent=4)

if __name__ == "__main__":
    main()

