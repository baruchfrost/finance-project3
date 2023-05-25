import os

input_dir = "./data/sector_etfs_dirty/"
output_dir = "./data/sector_etfs/"

def clean_file(input_path, output_path):
    with open(input_path, "r") as r_f, open(output_path, "w+") as w_f:
        # Skip the first line
        w_f.write(r_f.readline())

        for line in r_f.readlines():
            # get data
            split_line = line.split(",")
            vol_and_date = split_line[4:]
            date = vol_and_date.pop()
            volume = "".join(vol_and_date)

            # save data
            final_data = []
            final_data.extend(split_line[:4])
            final_data.append(volume)
            final_data.append(date)
            correct_line = ",".join(final_data)
            w_f.write(correct_line)

for filename in os.listdir(input_dir):
    if filename.endswith('.csv'):
        clean_file(os.path.join(input_dir, filename), os.path.join(output_dir, filename))
        print(f"Finished cleaning {os.path.join(input_dir, filename)}")