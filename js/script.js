'use strict';

var MyWallet      = require('blockchain-wallet-client/src/wallet')
  , Wallet        = require('blockchain-wallet-client/src/blockchain-wallet')
  , WalletCrypto  = require('blockchain-wallet-client/src/wallet-crypto')
  , fs            = require('fs')
  , $             = require('jquery');

MyWallet.syncWallet = function () { console.log('mock sync') };

function decryptWallet(event) {
  event.preventDefault();

  var walletFile      = document.getElementById('walletFile').files[0]
    , walletText      = $('#walletText').val()
    , walletPassword  = $('#walletPassword').val()
    , secondPassword  = $('#secondPassword').val();

  var encryptedWallet = walletFile ?
    fs.readFileSync(walletFile.path) : walletText;

  var decryptError = function (e) {
    console.log(e);
    $('#error-message').text(e);
  };

  var decryptSuccess = function (walletObject) {
    var mywallet = new Wallet(walletObject);
    if (mywallet.isDoubleEncrypted) {
      if (!mywallet.validateSecondPassword(secondPassword)) {
        return decryptError('Incorrect second password');
      }
      mywallet.decrypt(secondPassword, undefined, decryptError);
    }
    console.log(mywallet);
    try {
      var walletJSON = JSON.parse(JSON.stringify(mywallet.toJSON()));
    } catch (e) {
      return decryptError(e);
    }
    $('#step-1').hide();
    $('#step-2').show();
    $('#step-2 #wallet-info').html(generateAddressTable(walletJSON));
    $('#viewFullJSON').on('click', function (event) {
      event.preventDefault();
      $('#step-2').html(json2html(walletJSON));
    });
  };

  try {
    WalletCrypto.decryptWallet(
      encryptedWallet, walletPassword, decryptSuccess, decryptError
    );
  } catch (e) {
    decryptError(e.message || e);
  }
}

function generateAddressTable(wallet) {
  var table = '<table class="table">'
  table += '\
    <tr>\
      <th>#</th>\
      <th>Label</th>\
      <th>Address</th>\
      <th>Private Key</th>\
    </tr>';
  for (var index in wallet.keys) {
    var key = wallet.keys[index];
    table += '\
      <tr>\
        <td>' + index + '</td>\
        <td>' + (key.label || '<i>unlabeled</i>') + '</td>\
        <td>' + key.addr + '</td>\
        <td>' + key.priv + '</td>\
      </tr>';
  }
  table += '</table>';
  return table;
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

var walletInputType = 'file';
function toggleWalletInputType(event) {
  event.preventDefault();
  $('.wallet-input').val('');
  $('#wallet-input-' + walletInputType).hide();
  walletInputType = walletInputType === 'file' ? 'text' : 'file';
  $('#wallet-input-' + walletInputType).show();
}

$(function () {
  $('#walletForm').on('submit', decryptWallet);
  $('.toggleWalletInputType').on('click', toggleWalletInputType);
});
