/**
 *
 * */
(function() {
    'use strict';

    var competition = {
        'list': [
            {
                'name': 'User 1',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti minus nobis quaerat quod saepe sequi voluptas! Doloremque ducimus, ea eligendi fugiat harum iure iusto, magni obcaecati praesentium quod rem veniam!',
                'image': '../images/stub.jpg'
            },
            {
                'name': 'User 2',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti minus nobis quaerat quod saepe sequi voluptas! Doloremque ducimus, ea eligendi fugiat harum iure iusto, magni obcaecati praesentium quod rem veniam!',
                'image': '../images/stub.jpg'
            },
            {
                'name': 'User 3',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti minus nobis quaerat quod saepe sequi voluptas! Doloremque ducimus, ea eligendi fugiat harum iure iusto, magni obcaecati praesentium quod rem veniam!',
                'image': '../images/stub.jpg'
            },
            {
                'name': 'User 4',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti minus nobis quaerat quod saepe sequi voluptas! Doloremque ducimus, ea eligendi fugiat harum iure iusto, magni obcaecati praesentium quod rem veniam!',
                'image': '../images/stub.jpg'
            },
            {
                'name': 'User 5',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti minus nobis quaerat quod saepe sequi voluptas! Doloremque ducimus, ea eligendi fugiat harum iure iusto, magni obcaecati praesentium quod rem veniam!',
                'image': '../images/stub.jpg'
            },
            {
                'name': 'User 6',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti minus nobis quaerat quod saepe sequi voluptas! Doloremque ducimus, ea eligendi fugiat harum iure iusto, magni obcaecati praesentium quod rem veniam!',
                'image': '../images/stub.jpg'
            }
        ]
    };

    Object.keys(competition.list).forEach(function (el, i) {
        competition.list[i].index = i + 1;
    });

    return competition;
}());
