const express = require("express");
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require("fs");

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.

/*
2. newMnemonic API 만들기
수도 코드
mnemonic 변수를 만듭니다.
(응답) mnemonic 변수에 lightwallet.keystore.generateRandomSeed()을 담아, 
mnemonic을 응답으로 전송합니다.
(에러) 에러를 응답합니다.
 */
router.post("/newMnemonic", async (req, res) => {
  let mnemonic;
  try {
    mnemonic = lightwallet.keystore.generateRandomSeed();
    res.send({ mnemonic });
  } catch (err) {
    console.log(err);
  }
});

/*
3. Postman으로 테스트하여 니모닉코드 얻기
수도 코드
로컬 서버를 실행시키고, 엔드포인트를 정확히 입력합니다.
이 경우에는 http://localhost:3000/wallet/newMnemonic 입니다.
Postman에서 정확한 method POST 를 입력했다면, send를 눌러 서버로 요청을 보냅니다.
서버가 응답하는 니모닉 코드를 확인합니다.
 */

// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
/*
4. mnemonic code와 password를 이용해 newWallet API 만들기
수도 코드
password 와 mnemonic 을 입력값으로, 서버에 요청을 보냅니다.
password 와 mnemonic 변수를 만듭니다.
요청에 포함되어 있는 password 와 mnemonic을 각 변수에 할당합니다.
(응답) lightwallet.keystore.createVault를 사용하여 키스토어를 생성합니다.
첫번째 인자(options)에는 password, seedPhrase, hdPathString을 담습니다.
두번째 인자(callback)에는 키스토어를 인자로 사용하는 함수를 만듭니다.
eth-lightwallet 모듈의keystore.keyFromPassword(password, callback) 내장 함수를 사용합니다.
첫번째 인자에는 password, 두번째 인자(callback)에는 pwDerivedKey를 인자로 사용하는 함수를 만듭니다.
두번째 콜백함수가 실행되면, eth-lightwallet 모듈의 keystore.generateNewAddress(pwDerivedKey, [num])을 이용해 새로운 주소 생성 함수를 실행합니다.
address 변수를 만들고, keystore.getAddresses()을 문자열로 할당합니다.
keystore 변수를 만들고, keystore.serialize()을 할당합니다.
위에서 만들어준 변수를 응답으로 전송합니다.
(오류) 에러를 응답합니다.

 */
router.post("/newWallet", async (req, res) => {
  let password = req.body.password;
  let mnemonic = req.body.mnemonic;

  try {
    lightwallet.keystore.createVault(
      {
        password: password,
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'",
      },
      function (err, ks) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);

          let address = ks.getAddresses().toString();
          let keystore = ks.serialize();

          fs.writeFile("wallet.json", keystore, function (err, data) {
            if (err) {
              res.json({ code: 999, message: "실패" });
            } else {
              res.json({ code: 1, message: "성공" });
            }
          });
        });
      }
    );
  } catch (exception) {
    console.log("NewWallet ==>>>> " + exception);
  }
});

module.exports = router;

/*
5. Postman을 이용해 keystore와 address의 응답 API 테스트
수도 코드
로컬 서버를 실행시키고, 엔드포인트를 정확히 입력합니다.
이 경우에는 http://localhost:3000/wallet/newWallet 입니다.
Postman에서 정확한 method POST 를 입력했다면, send를 눌러 서버로 요청을 보냅니다.
이때, 3.에서 얻은 니모닉 코드를 mnemonic이라는 키의 값으로, password에는 원하는 비밀번호를 입력 후 send 버튼을 누릅니다.
 */

/*
6. 생성된 keystore를 json 파일로 만들어 로컬 서버에 저장하기
수도 코드
wallet.js 파일에 fs 모듈을 import 합니다. (fs 모듈은 Node.js 내장 모듈입니다.)
4.의 함수 keyFromPassword의 콜백 함수에서, 응답대신 fs.writeFile 또는 fs.writeFileSync 를 사용합니다.
첫번째 인자에는 .json 형식의 파일이름을, 두번째 인자에는 keystore 을 입력합니다.
세번째 인자에는 응답에 대한 콜백 함수를 입력합니다.
로컬 서버에 파일을 저장하기 때문에, 응답으로는 성공 또는 실패 메세지만 전송합니다.
 */

/**
 7. Postman을 실행하여, 로컬에 키스토어 파일이 생기는지 확인하기
수도 코드
5.에서처럼 동일하게 실행합니다.
로컬 서버의 경로에 파일이 생기는지 확인합니다.
 */
