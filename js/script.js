'use strict';

var MyWallet      = require('blockchain-wallet-client/src/wallet')
  , Wallet        = require('blockchain-wallet-client/src/blockchain-wallet')
  , WalletCrypto  = require('blockchain-wallet-client/src/wallet-crypto')
  , fs            = require('fs')
  , $             = require('jquery');

MyWallet.syncWallet = function () { console.log('mock sync') };

function decryptWallet(event) {
  event.preventDefault();

  var walletFilePath  = document.getElementById('walletFile').files[0].path
    , encryptedWallet = fs.readFileSync(walletFilePath)
    , walletPassword  = $('#walletPassword').val()
    , secondPassword  = $('#secondPassword').val();

  var decryptError = function (e) {
    console.log(e);
    $('#step-2').text(e);
  };

  var decryptSuccess = function (walletObject) {
    console.log(walletObject);
    var mywallet = new Wallet(walletObject);
    if (mywallet.isDoubleEncrypted) {
      if (!mywallet.validateSecondPassword(secondPassword)) {
        return decryptError('Incorrect second password');
      }
      mywallet.decrypt(secondPassword, undefined, decryptError);
    }
    var walletJSON = JSON.parse(JSON.stringify(mywallet.toJSON()));
    $('#step-1').hide();
    $('#step-2').html(json2html(walletJSON));
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
