from sqlalchemy import create_engine
import cx_Oracle
username = "username"
cx_Oracle.init_oracle_client(lib_dir="/Users/vaishnavi/Downloads/instantclient_19_8")
engine = create_engine('oracle+cx_oracle://' + username + ':password@oracle.cise.ufl.edu:1521/?service_name=orcl')
con = engine.connect()
con.execute('INSERT INTO DATES(full_date, month, day, year) VALUES({}, {}, {}, {})'.format(
                "TO_DATE('"  + formatted_date + "', 'MM-DD-YYYY')", str(month), "0" + str(i), str(year)))
