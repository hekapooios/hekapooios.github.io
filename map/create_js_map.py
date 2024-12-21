#!/usr/bin/env python3

import sys
import json
from datetime import datetime

OUT_FILE = "map__.js"
DATE_PLACEHOLDER = "big_date"
JS_TEMPLATE = "var map = \n%s"
TAG_COUNT_MAX = 5

# Not worth the hassle due to 8942 being "rom",
# half the SEPROMs being privately build and etc.

# def convert_version(version: str) -> int:
#     splitted = version.split("-")
#     tag = splitted[1]

#     tag_splitted = tag.split(".")

#     result = 0

#     for i in range(TAG_COUNT_MAX):
#         if i == 0:
#             max_count = 5
#         else:
#             max_count = 3
        
#         try:
#             result += int(tag_splitted[i]) * \
#                 (10 ** (TAG_COUNT_MAX - i + max_count))
#         except IndexError:
#             break

#     return result

def process_map(map_raw: dict):
    for key, val in map_raw.items():
        print("processing %s" % key)

        for idx, entry in enumerate(val["roms"]):
            date = entry["date"]
            if date == DATE_PLACEHOLDER:
                date = "1.1.30"

            version = entry["version"]

            timestamp = int(datetime.strptime(date, "%d.%m.%y").timestamp())

            # See the note above            
            # if version == "rom":
            #     version = "iBoot-878.8"

            # if key == "aps":
            #     int_version = convert_version(version)
            # else:
            #     int_version = idx

            entry["__date_sort"] = timestamp
            entry["__version_sort"] = idx   # int_version

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
