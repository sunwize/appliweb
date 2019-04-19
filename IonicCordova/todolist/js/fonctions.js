function openFirst() {
    console.log('Hallo?');
    var menuCtrl = document.querySelector('ion-menu-controller');
    menuCtrl.enable(true, 'first');
    menuCtrl.open('first');
}