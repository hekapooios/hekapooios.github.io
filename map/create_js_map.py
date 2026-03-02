#!/usr/bin/env python3

import os
import sys
import json

OUT_FILE = "map_v2.js"
JS_TEMPLATE = "var map = \n%s"

def process_map(map_raw: dict):
    for typ, socs in map_raw.items():
        print("processing %s" % typ)

        for soc in socs:
            for sect in soc["roms"]:
                for rom in sect:
                    if os.path.basename(rom["link"]).startswith("AppleSEPROM"):
                        rom["__seprom"] = True

                    title = rom["title"]
                    if title.startswith("private_build"):
                        splitted = rom["title"].split("...")
                        title = "...".join(splitted[:2]) + "..." + "\n" + "...".join(splitted[2:])

                    rom["__title"] = title

                    if rom.get("revisions") and len(rom["revisions"]) > 1:
                        for rev in rom["revisions"][:-1]:
                            rev["__not_last"] = True

                    rom["__divider"] = False

                sect[-1]["__divider"] = True

            soc["roms"][-1][-1]["__divider"] = False

            soc["roms"] = [
                x
                for xs in soc["roms"]
                for x in xs
            ]

            if len(soc["devices"]) > 2:
                devices = ", ".join(soc["devices"][:-1]) + " and %s" % soc["devices"][-1]
            elif len(soc["devices"]) == 2:
                devices = " and ".join(soc["devices"])
            elif len(soc["devices"]) == 1:
                devices = soc["devices"][0]
            else:
                continue

            if soc.get("type") == "uwb":
                base = "Ultra-wideband coprocessor"
            elif soc.get("type") == "security":
                base = "Security coprocessor"
            else:
                base = "SoC"

            soc["__devices"] = "%s for %s" % (base, devices)

def main():
    if len(sys.argv) != 2:
        print("%s <in>" % sys.argv[0])
        print("output will be written to %s" % OUT_FILE)
        exit(-1)

    _, inp = sys.argv

    with open(inp, "r") as f:
        map_raw = json.load(f)

    process_map(map_raw)

    with open(OUT_FILE, "w") as f:
        f.write(JS_TEMPLATE % json.dumps(map_raw, indent=4))

    print("DONE")

if __name__ == "__main__":
    main()
