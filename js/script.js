'use strict';

var bcsrc = 'node_modules/blockchain-wallet-client/src';

var stub          = require('m-stub')
  , Wallet        = stub.inject(bcsrc + '/blockchain-wallet', 'js/wallet-stub')
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
