var TMap = {};

function GMap(l, m) {
    TMap.map = new google.maps.Map(document.getElementById('TMapPanel'), {
        zoom: 10,
        center: { lat: -28, lng: 137 },
        mapTypeId: 'satellite'
    });
    google.maps.event.trigger(TMap.map, 'resize');
    TMap.markers = [];
    TMap.setMarker = function(l, m, title, id) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(l, m),
            animation: google.maps.Animation.DROP,
            title: title,
            itemId: id
        });
        marker.setMap(TMap.map);
        marker.addListener('click', function(x) {
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
    TMap.clearMarkers = function() {
        for (var i = 0; i < TMap.markers.length; i++) {
            TMap.markers[i].setMap(null);
        }
    };

};

App.view.define('VMain', {

    extend: 'Ext.Panel',
    alias: 'widget.mainform',
    border: false,

    layout: "border",

    items: [{
            region: 'north',
            height: 25,
            minHeight: 25,
            border: false,
            baseCls: 'cls-header',
            xtype: "Menu",
            itemId: "MenuPanel",
            menu: []
        },
        {
            region: "center",
            split: true,
            layout: "vbox",
            items: [{
                    layout: "hbox",
                    width: "100%",
                    height: 200,
                    items: [{
                        xtype: "grid",
                        itemId: "g0",
                        height: 200,
                        flex: 2,
                        multiSelect: true,
                        border: false,
                        tbar: [{
                                text: "Exporter",
                                iconCls: "export",
                                menu: [{
                                        text: "Photos",
                                        handler: function(me) {
                                            var grid = me.up('grid');
                                            var s = grid.getSelectionModel().getSelection();
                                            var OGRFID = [];
                                            for (var i = 0; i < s.length; i++) OGRFID.push(s[i].data.OGR_FID);
                                            var iframe = document.createElement('iframe');
                                            iframe.src = "/export/photos?id=" + OGRFID.join(',');
                                            iframe.style.display = "none";
                                            document.getElementsByTagName('body')[0].appendChild(iframe);
                                        }
                                    },
                                    {
                                        text: "Points",
                                        handler: function(me) {
                                            var grid = me.up('grid');
                                            var s = grid.getSelectionModel().getSelection();
                                            var OGRFID = [];
                                            for (var i = 0; i < s.length; i++) OGRFID.push(s[i].data.OGR_FID);
                                            var iframe = document.createElement('iframe');
                                            iframe.src = "/export/points?id=" + OGRFID.join(',');
                                            iframe.style.display = "none";
                                            document.getElementsByTagName('body')[0].appendChild(iframe);
                                        }
                                    },
                                    {
                                        text: "Segments",
                                        handler: function(me) {
                                            var grid = me.up('grid');
                                            var s = grid.getSelectionModel().getSelection();
                                            var OGRFID = [];
                                            for (var i = 0; i < s.length; i++) OGRFID.push(s[i].data.OGR_FID);
                                            var iframe = document.createElement('iframe');
                                            iframe.src = "/export/segments?id=" + OGRFID.join(',');
                                            iframe.style.display = "none";
                                            document.getElementsByTagName('body')[0].appendChild(iframe);
                                        }
                                    }
                                ]
                            },
                            {
                                text: "Actualiser",
                                iconCls: "refresh",
                                handler: function(me) {
                                    me.up('grid').getStore().load();
                                }
                            }
                        ],
                        features: [{
                            ftype: 'groupingsummary',
                            groupHeaderTpl: '{name}',
                            hideGroupedHeader: false,
                            enableGroupingMenu: true
                        }],
                        columns: [{
                                text: "Date",
                                dataIndex: "date"
                            },
                            {
                                text: "Limite",
                                dataIndex: "code_li",
                                flex: 1
                            },
                            {
                                text: "Ville",
                                dataIndex: "locality"
                            },
                            {
                                text: "Département",
                                dataIndex: "area"
                            },
                            {
                                text: "Région",
                                dataIndex: "region"
                            },
                            {
                                text: "Pays",
                                dataIndex: "country"
                            }
                        ],
                        store: App.store.create("rivages://import_segments{tkid,OGR_FID,annee+'-'+mois+'-'+jour+' '+heure=date-,annee-,mois-,jour-,heure-,code_li,country,area,region,locality}?status=1", {
                            autoLoad: true
                        })
                    }, {
                        xtype: "dataview",
                        itemId: "d0",
                        id: "images-view",
                        autoScroll: true,
                        height: 200,
                        store: App.store.create('App.Photos.getAll'),
                        tpl: [
                            '<tpl for=".">',
                            '<div class="thumb-wrap" id="{name:stripTags}">',
                            '<div class="thumb"><img src="{url}" title="{name:htmlEncode}"></div>',
                            '<span class="x-editable">{shortName:htmlEncode}</span>',
                            '</div>',
                            '</tpl>',
                            '<div class="x-clear"></div>'
                        ],
                        selectionModel: {
                            mode: 'SINGLE'
                        },
                        trackOver: true,
                        overItemCls: 'x-item-over',
                        itemSelector: 'div.thumb-wrap',
                        flex: 1
                    }]
                },
                {
                    itemId: "MyGMapPanel",
                    itemId: "map",
                    flex: 2,
                    html: '<div id="TMapPanel" style="width:100%;height:100%"></div>',
                    padding: 0,
                    border: false,
                    width: "100%",
                    border: false,
                    split: true
                }
            ]
        }
    ]

});