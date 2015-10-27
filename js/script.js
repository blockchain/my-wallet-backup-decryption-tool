var WALLET = '{"pbkdf2_iterations":5000,"version":2,"payload":"Tzh0X7+6KpI1p8WmBmMBOZqvrvWYy8zQkHWUStVENXWL0JBtEvidGQ8XYIVd817hf1vYE1m2dkbis4qgDxWirXQEEmumiwtl3nG+Ob0n9FdJyvGCuZjddIX8ZCOPo3tY7FjaDMGLV3OSRdZWHPZKNtO6PQgLuq3U+UsRIIz9xh5emn8n8r/PQuipk49zlCAS3lH+Z3EsW6avt/FXMdzOx+blxpo6AKUKs4IYIW3zT9Pvtwz2MKpI38dtF+QitoJInacxFtADopJkQw832r2LjU5LbOFos+gkeXy6xsUMxem4hvyfg0Od6ql5x8J2cP5/oQTeKZLKexSFeMhPlbokPytNKhqdNoZWpFWJ1XTqqAdKcIL2jIiSgCkEXUM1jjqteB6hI/Qtb8UnQ7Rpk+1XdfaoTgTZGc5phCls5nPx2D6vr4sNN8A9L+0oNeMA7cKFUKiYzdAfKc3zdCSrOVOOn7P7VxxwAIikiAxmZdtj2FJQS11GGMzSm0iJm2L1ipCxfekifop7zuqqS+fKap41koTqSDgKxxOv4xQxUFVfc1lgkdDaRom0IwkGwimdaf8HrdzTfscAf/BAp8LK8zcd6itqoLrLSFXsh8DI9IGBFDb+U5vRlXMkT7TR4APzhcj7MGHrPWi2bpjZBFlp87inOmeLmj4JXclTA3VgFtnyNneSBu78ORToG7IgK/J9Ah2io5n7Q+CXxs4l77MYC9ZA4jKQRg2phky7vLk/RqHQaoYkEMPR4DMLcpVTAVIniYyCJtR85uNEDaV20cVgGlU5rTqIRyihjsBhKizUzIEhA3dxl00Gqur/OFhg4hTZbRulAH1zeSDzdu0KbdzTboXhzJOcJDVeo9c2QpfKgnbnnYx4fpDgvu+/LIQdKUQmetihhSMwg6UfwhpgQBfYzzEUJV5zXUcIEgtsgz1n7HKn2l6EhNjmYSPSyswV+RlE+LDPuBmTC7WQvT3Ap9bLapWW0dI4uUfLhcWYVPX9JN7Ny7EiWGeuMpEp0Eenh3yDQtUy0QFd2letqGzJXYg71iP3xw=="}';
var PASSWORD = 'testtest13';
var SECOND_PASSWORD = "ViscaCatalunya";

'use strict';

var bcsrc = 'node_modules/blockchain-wallet-client/src';

var stub          = require('m-stub')
  , Wallet        = stub.inject(bcsrc + '/blockchain-wallet', bcsrc + '/wallet')
  , WalletCrypto  = require('blockchain-wallet-client/src/wallet-crypto')
  , fs            = require('fs')
  , $             = require('jquery');

function decryptWallet(event) {
  event.preventDefault();

  var walletFilePath  = document.getElementById('walletFile').files[0].path
    , encryptedWallet = fs.readFileSync(walletFilePath)
    , walletPassword  = $('#walletPassword').val();

  var decryptSuccess = function (d) {
    console.log(d);
    $('#step-1').hide();
    $('#step-2').html(json2html(d));
  };

  var decryptError = function (e) {
    console.log(e);
    $('#step-2').text(e);
  };

  WalletCrypto.decryptWallet(
    encryptedWallet, walletPassword, decryptSuccess, decryptError
  );
}

function json2html(obj) {
  var html = '<p>{</p>';
  html += '<div style="padding-left:25px;">'
  for (var key in obj) {
    if ('object' === typeof obj[key]) {
      html += '<p>' + key + ':</p>' + json2html(obj[key]);
    } else {
      html += '<p>' + key + ': ' + obj[key] + '</p>';
    }
  }
  html += '</div><p>}</p>';
  return html;
}

$(function () {
  $('#walletForm').on('submit', decryptWallet);
});
