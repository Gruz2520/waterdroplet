from Database import Databases

SQLDatabase = Databases.SQLDatabase()


def autodelete():
    """
    deletes transactions from db that have been created but no longer changed their status
    """
    trans_c = SQLDatabase.trans_conn.cursor()
    trans_c.execute('DELETE FROM transactions '
                    'WHERE (status = 0 OR status = 1)'
                    '  AND TIMESTAMPDIFF(MINUTE, date, NOW()) > 15;'
                    )
    SQLDatabase.trans_conn.commit()
    trans_c.close()


autodelete()
