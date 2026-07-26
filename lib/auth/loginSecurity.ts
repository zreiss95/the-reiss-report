import db from "@/lib/db/db";


const MAX_ATTEMPTS = 3;

const LOCK_TIME =
  24 * 60 * 60 * 1000;



export function checkLoginLock(
  ip: string
) {

  const record = db
    .prepare(`
      SELECT *
      FROM admin_login_attempts
      WHERE ip = ?
    `)
    .get(ip) as any;



  if (!record) {
    return false;
  }



  if (
    record.lockedUntil &&
    new Date(record.lockedUntil).getTime() >
      Date.now()
  ) {

    return true;

  }



  return false;

}



export function recordFailedLogin(
  ip: string
) {

  const current = db
    .prepare(`
      SELECT *
      FROM admin_login_attempts
      WHERE ip = ?
    `)
    .get(ip) as any;



  const attempts =
    (current?.attempts ?? 0) + 1;



  if (attempts >= MAX_ATTEMPTS) {

    db.prepare(`
      INSERT INTO admin_login_attempts
      (
        ip,
        attempts,
        lockedUntil,
        updatedAt
      )

      VALUES
      (
        ?,
        0,
        ?,
        datetime('now')
      )


      ON CONFLICT(ip)

      DO UPDATE SET

        attempts = 0,

        lockedUntil = excluded.lockedUntil,

        updatedAt = datetime('now')

    `)
    .run(
      ip,
      new Date(
        Date.now() + LOCK_TIME
      ).toISOString()
    );


    return;

  }



  db.prepare(`
    INSERT INTO admin_login_attempts
    (
      ip,
      attempts,
      updatedAt
    )

    VALUES
    (
      ?,
      ?,
      datetime('now')
    )


    ON CONFLICT(ip)

    DO UPDATE SET

      attempts = excluded.attempts,

      updatedAt = datetime('now')

  `)
  .run(
    ip,
    attempts
  );

}



export function clearFailedLogin(
  ip: string
) {

  db.prepare(`
    DELETE FROM admin_login_attempts
    WHERE ip = ?
  `)
  .run(ip);

}