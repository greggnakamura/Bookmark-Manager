/* global Firebase */
/* global angular */

'use strict';

angular.module('firebaseApp')
    .controller('MainCtrl', function ($scope, $timeout, FBURL) {

        var rootRef = new Firebase(FBURL);
        var bookmarksRef = rootRef.child('bookmarks');

        // scope variables
        $scope.date = null;
        $scope.description = null;
        $scope.link = null;
        $scope.tags = null;
        $scope.bookmarks = [];

        // bookmarks: add child
        bookmarksRef.on('child_added', function (snapshot) {
            $timeout(function () {
                var snapshotVal = snapshot.val();

                // create push object
                $scope.bookmarks.push({
                    date: snapshotVal.date,
                    description: snapshotVal.description,
                    link: snapshotVal.link,
                    tags: snapshotVal.tags,
                    name: snapshot.name()
                });

                $('input').val('');
            });
        });

        // bookmarks: change events
        // bookmarksRef.on('child_changed', function (snapshot) {
        //     $timeout(function () {
        //         var snapshotVal = snapshot.val();
        //         var bookmark = findByName(snapshot.name());
        //         bookmark.description = snapshotVal.description;
        //     });
        // });

        // bookmarks: delete
        bookmarksRef.on('child_removed', function (snapshot) {
            $timeout(function () {
                deleteByName(snapshot.name());
            });
        });

        //bookmarks: findByName
        // function findByName(name) {
        //     var bookmarkFound = null;
        //     for (var i = 0; i < $scope.bookmarks.length; i++) {
        //         var currentBookmark = $scope.bookmarks[i];
        //         if (currentBookmark.name === name) {
        //             bookmarkFound = currentBookmark;
        //             break;
        //         }
        //     }
        //     return bookmarkFound;
        // }

        // bookmarks: deleteByName
        function deleteByName(name) {
            for (var i = 0; i < $scope.bookmarks.length; i++) {
                var currentBookmark = $scope.bookmarks[i];
                if (currentBookmark.name === name) {
                    // splice current item off array
                    $scope.bookmarks.splice(i, 1);
                    break;
                }
            }
        }

        $scope.removeBookmark = function (index) {
            var item = $scope.bookmarks[index];
            var itemRef = bookmarksRef + '/' + item.name;
            console.log(itemRef);
            deleteByName(item.name);
        };

        // bookmarks: sendBookmark
        $scope.sendBookmark = function () {
            var currentDate = new Date();
            var dateTime = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth()+1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);

            var newBookmark = {
                date: dateTime,
                description: $scope.description,
                link: $scope.link,
                tags: $scope.tags
            };

            bookmarksRef.push(newBookmark);
        };

  });
