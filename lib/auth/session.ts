import crypto from "crypto";


const SESSION_SECRET =
  process.env.SESSION_SECRET;


if (!SESSION_SECRET) {
  throw new Error(
    "Missing SESSION_SECRET environment variable."
  );
}



function encode(
  value: object
) {
  return Buffer
    .from(
      JSON.stringify(value)
    )
    .toString("base64url");
}



function decode(
  value: string
) {
  return JSON.parse(
    Buffer
      .from(
        value,
        "base64url"
      )
      .toString()
  );
}



export function createAdminSession() {

  const payload = {

    id:
      crypto.randomUUID(),

    role:
      "admin",

    expires:
      Date.now() +
      1000 *
      60 *
      60 *
      8,

  };



  const data =
    encode(payload);



  const signature =
    crypto
      .createHmac(
        "sha256",
        SESSION_SECRET
      )
      .update(data)
      .digest("hex");



  return `${data}.${signature}`;

}




export function verifyAdminSession(
  token: string
) {

  try {

    const parts =
      token.split(".");


    if (
      parts.length !== 2
    ) {
      return false;
    }



    const [
      data,
      signature
    ] = parts;



    const expected =
      crypto
        .createHmac(
          "sha256",
          SESSION_SECRET
        )
        .update(data)
        .digest("hex");



    const signatureBuffer =
      Buffer.from(signature);


    const expectedBuffer =
      Buffer.from(expected);



    if (
      signatureBuffer.length !== expectedBuffer.length
    ) {
      return false;
    }



    if (
      !crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      )
    ) {
      return false;
    }



    const payload =
      decode(data);



    if (
      payload.role !== "admin"
    ) {
      return false;
    }



    if (
      typeof payload.expires !== "number"
    ) {
      return false;
    }



    if (
      payload.expires < Date.now()
    ) {
      return false;
    }



    return true;



  } catch {

    return false;

  }

}