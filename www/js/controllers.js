angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
//////////////////////////////////////não usado daqui para cima///////////////////////////////////////////////////////////////
.controller('FormCtrl', function($scope, $cordovaSQLite, $ionicPopup) {

  //ESCOPO ONDE SERÁ INSERIDO NO BANCO DE DADOS
  
  $scope.insert = function(estudante){
    var query = "INSERT INTO estudante (nome, email, senha) VALUES (?, ?, ?)";
    $cordovaSQLite.execute(db, query, [estudante.nome, estudante.email, estudante.senha]).then(function(){
      $ionicPopup.alert({
          title: "Informação",
          template: "Dados salvos com successo",
          okText: 'Ok',
          okType: 'button-positive'
      });
    }, function(err){
      console.log(err.message);
    });

  }

})
//CONTROLLER PARA CARREGAR OS DADOS
.controller('LoadCtrl', function($scope, $ionicModal, $ionicPopup, $ionicLoading, $timeout, $cordovaSQLite) {

    //TIME PARA CARREGAR INFORMAÇÕES DO BANCO
    $timeout(function () {
        $ionicLoading.hide();
        $scope.load();
    }, 3000);

    //REFRESH DA PÁGINA
    $scope.doRefresh = function() {
       $timeout(function() {
         $scope.load();
         $scope.$broadcast('scroll.refreshComplete');
       }, 3000);
    };

    //CARREGAR OS DADOS DO BANCO
   $scope.load = function() {
    $scope.estudantes = [];
    $cordovaSQLite.execute(db, "SELECT * FROM estudante")
      .then(
        function(res) {
          if (res.rows.length) {
            for (var i = 0; i < res.rows.length; i++) {
             $scope.estudantes.push(res.rows.item(i)); 
            }
            $scope.status = "Results";
          }
        }, function (err) {
          $scope.status = "Erro: " + err.message;
        }
      );

  }

  //ESCOPOS PARA EDITAR OS DADOS
  $scope.put = {};
  $scope.edit = function () {
            var query = "update estudante set nome = ?,email=?,senha=? where id=?";
            $cordovaSQLite.execute(db, query, [
                $scope.put.nome,
                $scope.put.email,
                $scope.put.senha,
                $scope.put.id
            ]).then(function () {
                $ionicPopup.alert({
                    title: "Informação",
                    template: "Dados alterados com sucesso",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
                $scope.load();
            }, function (err) {
                console.log(err.message);
            });
        };

  //CARREGAMENTO DA PÁGINA
  $ionicLoading.show({
      template: 'Carregando...'
  });

  //DEFINIÇÃO DA PÁGINA COMO MODAL
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalEdit = modal;
  });

  //FECHAR A PÁGINA MODAÇ
  $scope.closeLogin = function() {
    $scope.modalEdit.hide();
  };

  //OPÇÕES AO CLICAR NO ITEM E FUNÇÃO DE DELETAR
  $scope.click = function (estudante) {
      $ionicPopup.show({
        title: 'Confirme',
        template: "O que deseja fazer?",
        buttons: [
          {
            //APAGA O REGISTRO
            text: 'Apagar',
            type: 'button-assertive',
            onTap: function () {
              var query = "delete from estudante where id = ?";
              $cordovaSQLite.execute(db, query, [estudante.id]).then(function () {
                $ionicPopup.alert({
                  title: "Informação",
                  template: "Delete estudante success",
                  okText: 'Ok',
                  okType: 'button-positive'
                });
                $scope.load();
              }, function (err) {
                console.log(err.message);
              });
            }
        },
        {
          //CHAMA O MODAL DE EDITAR
          text: 'Editar',
          type: 'button-positive',
          onTap: function () {
            $scope.put = estudante;
            $scope.modalEdit.show();
          }
        }
        ]
      });
  };
})

;
