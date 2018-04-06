var TMap = {};

function GMap(l, m) {
    TMap.map = new google.maps.Map(document.getElementById('TMapPanel'), {
        zoom: 10,
        center: {
            lat: -28,
            lng: 137
        },
        mapTypeId: 'satellite'
    });
    google.maps.event.trigger(TMap.map, 'resize');
    TMap.markers = [];
    TMap.setMarker = function (l, m, title, id) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(l, m),
            animation: google.maps.Animation.DROP,
            title: title,
            itemId: id
        });
        marker.setMap(TMap.map);
        marker.addListener('click', function (x) {
            var dir = this.itemId.split('|')[1] + '/rivages_' + this.itemId.split('|')[2];
            var d = new Date();
            dir = d.getTime() + "/" + dir;
            var infowindow = new google.maps.InfoWindow({
                content: [
                    '<div width="100%" align=center><img src="/thumbs/' + dir + '"></img></div>',
                    '<div><small>rivages_' + this.itemId.split('|')[2] + '</small></div>'
                ].join('')
            });
            infowindow.open(TMap.map, this);
        });
        TMap.markers.push(marker);
        return marker;
    };
    TMap.clearMarkers = function () {
        for (var i = 0; i < TMap.markers.length; i++) {
            TMap.markers[i].setMap(null);
        }
    };

};

App.controller.define('CMain', {

    views: [
        "VMain",
        "VEdImage"
    ],

    models: [],

    init: function () {

        this.control({
            "menu>menuitem": {
                click: "Menu_onClick"
            },
            "mainform grid": {
                itemclick: "grid_onclick",
                itemcontextmenu: "grid_onContextMenu"
            },
            "mainform dataview#d0": {
                itemdblclick: "dataview_click"
            }
        });

        App.init('VMain', this.onLoad);

    },
    grid_onContextMenu: function (view, rec, node, index, e) {
        e.stopEvent();
        var x = Ext.create('Ext.menu.Menu', {
            items: [{
                itemId: 'ctx-grid-delete',
                text: "Supprimer"
            }]
        });
        x.on('click', function (p) {
            function showResult(btn) {
                if (btn == "yes") {
                    var s = App.get('mainform grid#g0').getSelectionModel().getSelection();
                    var tkid = [];
                    for (var i = 0; i < s.length; i++) tkid.push(s[i].data.tkid);
                    App.Map.delete(tkid, function () {
                        App.get('mainform grid#g0').getStore().load();
                    });
                };
            };
            if (p.itemId = "ctx-grid-delete") {
                Ext.MessageBox.confirm('Rivages', 'Voulez vous vraiment supprimer ces enregistrements ?', showResult);
            }
        });
        x.showAt(e.getXY());
        return false;
    },
    Menu_onClick: function (p) {
        if (p.itemId) {
            //Ext.Msg.alert('Status', 'Click event on '+p.itemId);
        };
    },
    dataview_click: function (me, store, item, record) {
        if (me.getStore().data.items.length) var total = me.getStore().data.items.length;
        else var total = 1;
        App.view.create('VEdImage', {
            modal: true,
            itm: store.store.data.items,
            tkid: store.data.tkid,
            ndx: record + 1,
            total: total,
            filename: store.data.filename
        }).show().center();
    },
    grid_onclick: function (me, store) {
        var map = TMap.map;
        var featureStyle = {
            fillColor: '#ADFF2F',
            fillOpacity: 0.1,
            strokeColor: '#ADFF2F',
            strokeWeight: 1
        };
        TMap.clearMarkers();
        App.get('mainform dataview#d0').getStore().getProxy().extraParams.tkid = store.data.tkid;
        App.get('mainform dataview#d0').getStore().load();

        function processPoints(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function (g) {
                    processPoints(g, callback, thisArg);
                });
            }
        };
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });
        map.data.loadGeoJson('/geojson?ofid=' + store.data.OGR_FID);
        map.data.setStyle({
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 5
        });
        var bounds = new google.maps.LatLngBounds();
        map.data.addListener('addfeature', function (e) {
            processPoints(e.feature.getGeometry(), bounds.extend, bounds);
            map.fitBounds(bounds);
        });
        App.DB.get("rivages://import_photos{SHAPE,tkid,filename}?tkid=" + store.data.tkid, function (r) {
            for (var i = 0; i < r.data.length; i++) {
                TMap.setMarker(r.data[i].SHAPE.y, r.data[i].SHAPE.x, r.data[i].filename, 'tkid|' + r.data[i].tkid + '|' + r.data[i].filename.split('rivages_')[1]);
            };
        });
    },
    onLoad: function () {
        App.loadAPI("https://maps.google.com/maps/api/js?key=AIzaSyBGeTjkThZZxksjNXRFR0pahygHQRalpCU&sensor=false&callback=GMap");

        Auth.login(function () {

        });

    }


});