export const templateForgotPassword = (name, link) => {
	return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Reset Password</title>
  </head>
  <body>
    <div class="es-wrapper-color">
        
      <table class="es-wrapper" width="100%">
        <tbody>
          <tr>
            <td class="esd-email-paddings" valign="top">
              <table
                class="es-content"
                cellspacing="0"
                cellpadding="0"
                align="center"
              >
                <tbody>
                  <tr>
                    <td
                      class="esd-stripe"
                      style="background-color: #fafafa"
                      bgcolor="#fafafa"
                      align="center"
                    >
                      <table
                        class="es-content-body"
                        style="background-color: #ffffff"
                        width="600"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="esd-structure es-p40t es-p20r es-p20l"
                              style="
                                background-color: transparent;
                                background-position: left top;
                              "
                              bgcolor="transparent"
                              align="left"
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      class="esd-container-frame"
                                      width="560"
                                      valign="top"
                                      align="center"
                                    >
                                      <table
                                        style="background-position: left top"
                                        width="100%"
                                        cellspacing="0"
                                        cellpadding="0"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              class="esd-block-image es-p5t es-p5b"
                                              align="center"
                                              style="font-size: 0"
                                            >
                                              <a target="_blank"
                                                ><img
                                                  src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png"
                                                  alt
                                                  style="display: block"
                                                  width="175"
                                              /></a>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              class="esd-block-text es-p15t es-p15b"
                                              align="center"
                                            >
                                              <h1
                                                style="
                                                  color: #333333;
                                                  font-size: 20px;
                                                "
                                              >
                                                <strong>FORGOT YOUR PASSWORD? </strong>
                                              </h1>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              class="esd-block-text es-p40r es-p40l"
                                              align="left"
                                            >
                                              <p style="text-align: center">
                                                HI; ${name}                                                
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              class="esd-block-text es-p35r es-p40l"
                                              align="left"
                                            >
                                              <p style="text-align: center">
                                                There was a request to change
                                                your password!
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              class="esd-block-text es-p25t es-p40r es-p40l"
                                              align="center"
                                            >
                                              <p>
                                                If did not make this request,
                                                just ignore this email.
                                                Otherwise, please click the
                                                button below to change your
                                                password:
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              class="esd-block-button es-p40t es-p40b es-p10r es-p10l"
                                              align="center"
                                            >
                                              <span class="es-button-border"
                                                ><a
                                                  href=${link}
                                                  class="es-button"
                                                  target="_blank"
                                                  >RESET PASSWORD</a
                                                ></span
                                              >
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                         
        </tbody>
      </table>
    </div>
  </body>
</html>
`;
};
