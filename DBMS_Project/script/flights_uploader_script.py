from sqlalchemy import create_engine
import pandas as pd
import cx_Oracle
import os
import csv

username = "username"
lib_dir = os.path.join(os.getcwd(), "instantclient_19_8")
cx_Oracle.init_oracle_client(lib_dir='/Users/vaishnavi/Downloads/instantclient_19_8')
engine = create_engine('oracle+cx_oracle://' + username + ':password@oracle.cise.ufl.edu:1521/?service_name=orcl')
con = engine.connect()


def writetocsv(record, file_name="log.csv"):
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


writetocsv(
    "YEAR,QUARTER,MONTH,DAY_OF_MONTH,DAY_OF_WEEK,FL_DATE,MKT_UNIQUE_CARRIER,MKT_CARRIER_FL_NUM,TAIL_NUM,ORIGIN,"
    "ORIGIN_CITY_NAME,ORIGIN_STATE_ABR,ORIGIN_STATE_NM,DEST,DEST_CITY_NAME,DEST_STATE_ABR,DEST_STATE_NM,CRS_DEP_TIME,"
    "DEP_TIME,DEP_DELAY,DEP_DELAY_NEW,DEP_DEL15,DEP_DELAY_GROUP,DEP_TIME_BLK,TAXI_OUT,WHEELS_OFF,WHEELS_ON,TAXI_IN,"
    "CRS_ARR_TIME,ARR_TIME,ARR_DELAY,ARR_DELAY_NEW,ARR_DEL15,ARR_DELAY_GROUP,ARR_TIME_BLK,CANCELLED,"
    "CANCELLATION_CODE,CRS_ELAPSED_TIME,ACTUAL_ELAPSED_TIME,AIR_TIME,DISTANCE,DISTANCE_GROUP,CARRIER_DELAY,"
    "WEATHER_DELAY,NAS_DELAY,SECURITY_DELAY,LATE_AIRCRAFT_DELAY,ERROR".split(
        ','))

df = pd.read_csv('output_3.csv')

abbr = {"AA": "American Airlines",
        "AS": "Alaska Airlines",
        "B6": "JetBlue",
        "DL": "Delta Air Lines",
        "F9": "Frontier Airlines",
        "G4": "Allegiant Air",
        "HA": "Hawaiian Airlines",
        "NK": "Spirit Airlines",
        "UA": "United Airlines",
        "WN": "Southwest Airlines"}

counter = 0
for index, row in df.iterrows():
    counter += 1
    print(counter)
    dist = row['DISTANCE'] if not (pd.isnull(row['DISTANCE'])) else 0
    dest_city_name = row['DEST_CITY_NAME'] if not (pd.isnull(row['DEST_CITY_NAME'])) else 0
    orig_city_name = row['ORIGIN_CITY_NAME'] if not (pd.isnull(row['ORIGIN_CITY_NAME'])) else 0

    dest =  dest_city_name.split(',') if dest_city_name != 0 else ["0","0"]
    origin = orig_city_name.split(',') if orig_city_name != 0 else ["0","0"]
    res = con.execute(
        "SELECT * FROM \"NAYAN.JAIN\".LOCATIONS WHERE CITY = '" + dest[0] + "' AND STATE_ID ='" + dest[1].strip(
            ' ') + "'")

    destination_id = 0
    for item in res:
        destination_id = item[0]
        break

    if destination_id == 0:
        row['Error'] = "destination_id=0"
        writetocsv(row)
        continue

    res = con.execute(
        "SELECT * FROM \"NAYAN.JAIN\".LOCATIONS WHERE CITY = '" + origin[0] + "' AND STATE_ID ='" + origin[1].strip(
            ' ') + "'")

    origin_id = 0
    for item in res:
        origin_id = item[0]
        break

    if origin_id == 0:
        row['Error'] = "origin_id=0"
        writetocsv(row)
        continue

    mkt_unique_car_num = abbr[row['MKT_UNIQUE_CARRIER']] if not (pd.isnull(row['MKT_UNIQUE_CARRIER'])) else 0
    mkt_car_flt_num = row['MKT_CARRIER_FL_NUM'] if not (pd.isnull(row['MKT_CARRIER_FL_NUM'])) else 0

    res = con.execute(
        "SELECT * FROM \"NAYAN.JAIN\".AIRLINE_COMPANY WHERE UNIQUE_CARRIER = '" + mkt_unique_car_num + "' AND "
                                                                                                       "FLIGHT_NUMBER ="
        + str(mkt_car_flt_num))

    airline_id = 0
    for item in res:
        airline_id = item[0]
        break

    if airline_id == 0:
        row['Error'] = "airline_id=0"
        writetocsv(row)
        continue

    crs_arr_time = row['CRS_ARR_TIME'] if not (pd.isnull(row['CRS_ARR_TIME'])) else 0
    arr_time = row['ARR_TIME'] if not (pd.isnull(row['ARR_TIME'])) else 0
    arr_delay = row['ARR_DELAY'] if not (pd.isnull(row['ARR_DELAY'])) else 0
    arr_time_bulk = row['ARR_TIME_BLK'] if not (pd.isnull(row['ARR_TIME_BLK'])) else 0

    res = con.execute(
        "SELECT * FROM \"NAYAN.JAIN\".ARRIVAL WHERE CRS_ARR_TIME = " + str(crs_arr_time) + " AND ARR_TIME =" + str(
            arr_time) + " AND ARR_DELAY =" + str(arr_delay) + " AND ARR_TIME_BLK =" + str(arr_time_bulk) + ""
    )

    arrival_id = 0
    for item in res:
        arrival_id = item[0]
        break

    if arrival_id == 0:
        row['Error'] = "arrival_id=0"
        writetocsv(row)
        continue

    act_elapsed_time = row['ACTUAL_ELAPSED_TIME'] if not (pd.isnull(row['ACTUAL_ELAPSED_TIME'])) else 0
    crs_elapsed_time = row['CRS_ELAPSED_TIME'] if not (pd.isnull(row['CRS_ELAPSED_TIME'])) else 0

    res = con.execute(
        "SELECT * FROM \"NAYAN.JAIN\".CANCELATIONS WHERE ACTUAL_ELAPSED_TIME = " + str(
            act_elapsed_time) + " AND CRS_ELAPSED_TIME =" + str(crs_elapsed_time) + ""
    )

    cancellation_id = 0
    for item in res:
        cancellation_id = item[0]
        break

    if cancellation_id == 0:
        row['Error'] = "cancellation_id=0"
        writetocsv(row)
        continue

    date = row['FL_DATE']
    date = date.split('/')
    if len(date[0]) > 1 :
        date = date[0] + "-" + date[1] + "-" + date[2]
    else:
        date = "0" + date[0] + "-" + date[1] + "-" + date[2]
    print(date)
    con.execute("ALTER SESSION SET NLS_DATE_FORMAT = 'MM-DD-YYYY'")

    res = con.execute(
        "SELECT * FROM \"NAYAN.JAIN\".DATES WHERE FULL_DATE = TO_DATE('" + str(
            date) + "')"
    )

    date_id = 0

    for item in res:
        date_id = item[0]
        break

    if date_id == 0:
        row['Error'] = "date_id=0"
        writetocsv(row)
        continue

    crs_dept_time = row['CRS_DEP_TIME'] if not (pd.isnull(row['CRS_DEP_TIME'])) else 0
    dept_time_bulk = row['DEP_TIME_BLK'] if not (pd.isnull(row['DEP_TIME_BLK'])) else 0
    wheels_on = row['WHEELS_ON'] if not (pd.isnull(row['WHEELS_ON'])) else 0
    dep_time = row['DEP_TIME_BLK'] if not (pd.isnull(row['DEP_TIME_BLK'])) else 0
    wheels_off = row['WHEELS_OFF'] if not (pd.isnull(row['WHEELS_OFF'])) else 0
    depature_delay = row['DEP_DELAY'] if not (pd.isnull(row['DEP_DELAY'])) else 0
    depature_time = row['DEP_TIME'] if not (pd.isnull(row['DEP_TIME'])) else 0
    crs = row['CRS_DEP_TIME'] if not (pd.isnull(row['CRS_DEP_TIME'])) else 0

    if pd.isnull(crs):
        crs = 0
    if pd.isnull(dep_time):
        dep_time = 0
    if pd.isnull(wheels_on):
        wheels_on = 0
    if pd.isnull(wheels_off):
        wheels_off = 0
    if pd.isnull(depature_delay):
        depature_delay = 0
    if pd.isnull(depature_time):
        depature_time = 0

    # print(row['CRS_DEP_TIME'], row['DEP_TIME_BLK'], row['WHEELS_ON'], wheels_off, depature_delay, depature_time)
    con.execute(
        "INSERT INTO \"NAYAN.JAIN\".FLIGHTS( DISTANCE, FK_DESTINATION_ID, FK_ORIGIN_ID, FK_AIRLINE_ID, FK_ARRIVAL_ID, "
        "FK_CANCELLATION_ID, FK_DATE_ID, CRS_DEP_TIME, DEP_TIME_BLK, WHEELS_ON, WHEELS_OFF, DEP_DELAY, DEP_TIME) "
        "VALUES({},{},{},{},{},{},{},{},'{}',{},{},{},{})".format(dist, destination_id, origin_id, airline_id,
                                                                  arrival_id, cancellation_id,
                                                                  date_id, crs, dep_time, wheels_on, wheels_off,
                                                                  depature_delay,
                                                                  depature_time))