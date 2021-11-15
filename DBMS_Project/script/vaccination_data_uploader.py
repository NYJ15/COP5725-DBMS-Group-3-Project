import os
import sys
import config
import cx_Oracle


def parse_me(filename):
    rows = []

    with open(filename, 'r') as infile:
        lines = infile.readlines()
    counter = 1

    for line in lines[1:]:
        row = []
        line = line.split(',')

        _date = line[0].split('-')
        _date = _date[1] + '-' + _date[2] + '-' + _date[0]
        row.append(counter)
        row.append(_date)
        line[2] = 0 if line[2] == '' else line[2]
        row.append(line[2])
        line[4] = 0 if line[4] == '' else line[4]
        row.append(line[4])
        line[11] = 0 if line[11] == '' else line[11]
        row.append(line[11])
        line[1] = 0 if line[1] == '' else line[1]
        row.append(line[1])
        counter += 1

        rows.append(row)

    return rows


# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    data_to_insert = parse_me('us_state_vaccinations.csv')

    try:
        lib_dir = os.path.join(os.getcwd(), "instantclient_19_8")
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)

        connection = None
        try:
            connection = cx_Oracle.connect(
                config.username,
                config.password,
                config.dsn,
                encoding=config.encoding)

            cursor = connection.cursor()
            traveler_throughput_id = 1

            with open('InsertVaccineData.txt', 'w+') as outfile:
                alter_session = "ALTER SESSION SET NLS_DATE_FORMAT = 'MM-DD-YYYY'"
                cursor.execute(alter_session)
                for data in data_to_insert:

                    # Find the date id
                    _query = 'SELECT * FROM \"NAYAN.JAIN\".DATES WHERE FULL_DATE={}'.format("'"+data[1]+"'")
                    returned_data = cursor.execute(_query)
                    for item in returned_data:
                        _date_id = item[0]
                        break

                    # Find the location id
                    _query = 'SELECT LOCATION_ID FROM (SELECT * FROM \"NAYAN.JAIN\".LOCATIONS WHERE STATES=\''+data[5]+'\'order by location_id) where rownum=1'
                    returned_data = cursor.execute(_query)
                    for item in returned_data:
                        _location_id = item[0]
                        break

                    # Insert data
                    query = 'INSERT INTO \"NAYAN.JAIN\".COVID_19_VACCINATION VALUES({}, {}, {}, {}, {});'.format(
                                     data[0], data[6], data[5], _date_id, _location_id)

                    outfile.write(query)
                    outfile.write('\n')
                    print(query)
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