import os
import sys
import config
import cx_Oracle
import csv

def writetocsv(record, file_name="log_cases.csv"):
    """Writes records which failed to csv file"""

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    if os.path.exists(os.path.join(BASE_DIR, file_name)):
        append_write = 'a'
    else:
        append_write = 'w'
    with open(os.path.join(BASE_DIR, file_name), append_write,
              encoding='utf-8') as f:
        csvwriter = csv.writer(f, delimiter=',')
        try:
            csvwriter.writerow(dict(record).values())
        except ValueError:
            csvwriter.writerow(record)
    f.close()

def parse_me(filename):
    rows = []
    with open(filename, 'r') as infile:
        lines = infile.readlines()
    counter = 1
    for line in lines[1:]:
        row = []
        line = line.split(',')
        row.append(counter)
        # row.append(line[5].split("\"")[1])
        row.append(line[0])
        row.append(line[1])
        row.append(line[2])
        row.append(line[3])
        row.append(line[4])
        row.append(line[5])



        # row.append(line[3].split("\"")[1])
        # row.append(line[2].split("\"")[1])
        counter += 1
        rows.append(row)
    return rows


# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    data_to_insert = parse_me('us-counties.csv')

    try:
        # lib_dir = os.path.join(os.getcwd(), "instantclient_19_8")
        cx_Oracle.init_oracle_client(lib_dir='/Users/vaishnavi/Downloads/instantclient_19_8')

        connection = None
        try:
            connection = cx_Oracle.connect(
                config.username,
                config.password,
                config.dsn,
                encoding=config.encoding)

            cursor = connection.cursor()
            traveler_throughput_id = 1
            writetocsv("date,county,state,fips,cases,deaths".split(','))
            

            with open('Insert_cases.txt', 'w+') as outfile:
                alter_session = "ALTER SESSION SET NLS_DATE_FORMAT = 'MM-DD-YYYY'"
                cursor.execute(alter_session)
                for data in data_to_insert:
                    # Find the date id
                    date = data[1].split('-')
                    _query = 'SELECT * FROM \"NAYAN.JAIN\".DATES WHERE YEAR={} and MONTH={} and DAY={}'.format(date[0], date[1], date[2])
                    returned_data = cursor.execute(_query)
                    for item in returned_data:
                        _date_id = item[0]
                        break
                    # Find the location id
                    try:
                        _query = 'SELECT * FROM "NAYAN.JAIN".Locations WHERE STATES=\''+ data[3] +'\' AND COUNTY=\''+ data[2] +'\' ORDER BY location_id FETCH FIRST 1 ROWS ONLY'
                        returned_data = cursor.execute(_query)
                        for item in returned_data:
                            _location_id = item[0]
                            break
                    

                        query = 'INSERT INTO \"NAYAN.JAIN\".COVID_19_CASES VALUES({}, {}, {}, {}, {});'.format(data[0], data[6], data[5], _date_id, _location_id)
                        
                        outfile.write(query)
                        outfile.write('\n')
                        print(data[0])
                    except:
                        writetocsv({'row':data})

                        pass
            sys.exit(1)


        except cx_Oracle.Error as error:
            print(error)

        finally:
            if connection:
                connection.close()
                print("Done, closed everything!")

    except Exception as err:
        print("Whoops!")
        print(err)