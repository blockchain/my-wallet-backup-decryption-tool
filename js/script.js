'use strict';

var MyWallet      = require('blockchain-wallet-client-prebuilt/src/wallet')
  , Wallet        = require('blockchain-wallet-client-prebuilt/src/blockchain-wallet')
  , WalletCrypto  = require('blockchain-wallet-client-prebuilt/src/wallet-crypto')
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

  var resetForm = function () {
    $('#error-message').text('');
    $('#walletForm')[0].reset();
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
    resetForm();
    goToStep(2);
    toggleWalletView(walletJSON);
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

function goToStep(step) {
  $('.step').hide();
  $('#step-' + step).show();
}

function toggleWalletView(data) {
  var walletView = 'Table';
  function setWalletView(event) {
    event && event.preventDefault();
    var innerHTML = walletView === 'JSON' ? '<pre>' + json2html(data) + '</pre>' : generateAddressTable(data);
    var copyToClip = walletView === 'JSON' ? 'Copy to Clipboard' : '';
    var innerText = walletView = walletView === 'JSON' ? 'Table' : 'JSON';

    $('#step-2 #wallet-info').html(innerHTML);
    $('#toggleWalletView').text('View ' + innerText);
    $('#copy-to-clip').text(copyToClip);
  }
  setWalletView();
  $('#toggleWalletView').on('click', setWalletView);
}

var walletInputType = 'file';
function toggleWalletInputType(event) {
  event.preventDefault();
  $('.wallet-input').val('');
  $('#wallet-input-' + walletInputType).hide();
  walletInputType = walletInputType === 'file' ? 'text' : 'file';
  $('#wallet-input-' + walletInputType).show();
}

function toggleWalletInputClass() {
  var filled = $(this).val().length > 0 ? 'filled' : '';

  $(this).removeClass('filled');
  $(this).addClass(filled);
}

function triggerCopy(event) {
  event.preventDefault();

  var text = document.querySelector('pre');
  var range = document.createRange();
  var selection;

  range.setStartBefore(text.firstChild);
  range.setEndAfter(text.lastChild);

  selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
}

$(function () {
  $('#walletForm').on('submit', decryptWallet);
  $('.toggleWalletInputType').on('click', toggleWalletInputType);
  $('#goBack').on('click', goToStep.bind(null, 1));
  $('input[type="password"').on('keydown', toggleWalletInputClass);
  $('#copy-to-clip').on('click', triggerCopy);
});
