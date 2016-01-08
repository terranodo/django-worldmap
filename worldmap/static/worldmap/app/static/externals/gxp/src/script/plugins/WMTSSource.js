/*** Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/LayerSource.js
 * @requires OpenLayers/Layer/WMTS.js
 * @requires GeoExt/data/WMTSCapabilitiesReader.js
 * @requires GeoExt/data/WMTSCapabilitiesStore.js
 * @requires OpenLayers/Format/WMTSCapabilities/v1_0_0.js
 */

Ext.ns('gxp.data', 'gxp.plugins');

/** api: (define)
 *  module = gxp.plugins
 *  class = TMSSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */

/** api: constructor
 *  .. class:: WMTSSource(config)
 *
 *    Plugin for using WMTS layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a Capabilities request to create a store of the WMTS's
 *    tile maps. It is currently not supported to use this source type directly
 *    in the viewer config, it is only used to add a TMS service dynamically
 *    through the AddLayers plugin.
 */
gxp.plugins.WMTSSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_wmtssource */
    ptype: "gxp_wmtssource",

    /** api: config[url]
     *  ``String`` WMTS service URL for this source
     */

    /** api: config[version]
     *  ``String`` WMTS version to use, defaults to 1.0.0
     */
    version: "1.0.0",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WMTSSource.superclass.constructor.apply(this, arguments);
        this.format = new OpenLayers.Format.WMTSCapabilities();
    },
    /** private: method
     */
    getCapabilitiesUrl: function(url, version) {
        var request = url;
        if (request.indexOf("?") === -1) { // has no '?'
            request = request + "?service=WMTS&request=GetCapabilities&version="+version;
        }
        else if ((request.indexOf("?")+1) === request.length) { // ends with '?"
            request = request + "service=WMTS&request=GetCapabilities&version="+version;
        }
        else { // check each required parameter
            request = request.toLowerCase().indexOf("service=wmts") === -1 ? request + "&service=WMTS" : request;
            request = request.toLowerCase().indexOf("request=getcapabilities") === -1 ? request + "&request=GetCapabilities" : request;
            request = request.toLowerCase().indexOf("version=") === -1 ? request + "&version=" + version : request;
        }
        return request;
    },
    /** private: method
     */
    getTitle: function(rawResponse) {
        if (rawResponse.serviceIdentification) {
            if (rawResponse.serviceIdentification.title) {
                return rawResponse.serviceIdentification.title;
            }
            else if (rawResponse.serviceIdentification.title) {
                return rawResponse.serviceIdentification.title;
            }
        }
        return null;
    },
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        var format = this.format;
        cleanurl = this.getCapabilitiesUrl(this.url, this.version);
        this.store = new GeoExt.data.WMTSCapabilitiesStore({
            autoLoad: true,
            url: cleanurl,
            version: this.version,
            listeners: {
                load: function() {
                    this.title = this.getTitle(this.store.reader.raw);
                    this.fireEvent("ready", this);
                },
                exception: function() {
                    var msg = "Trouble creating WMTS layer store from response.";
                    var details = "Unable to handle response.";
                    this.fireEvent("failure", this, msg, details);
                },
                scope: this
            },
            proxy: new Ext.data.HttpProxy({
                 url: this.getCapabilitiesUrl(this.url, this.version),
                 disableCaching: false,
                 method: "GET"
             })
        });
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord`` or null when the source is lazy.
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config, callback, scope) {
        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            var record = this.store.getAt(index);
            var layer = record.getLayer();
            if (layer.matrixSet !== null) {
				// data for the new record
				var data = Ext.applyIf({
					group: config.group,
					source: config.source
				}, record.data);

				// add additional fields
				var fields = [
					{name: "group", type: "string"},
					{name: "source", type: "string"}
				];

				record.fields.each(function(field) {
					fields.push(field);
				});

				var Record = GeoExt.data.LayerRecord.create(fields);
				var r = new Record(data, layer.id);

                return r;
            }
        }
    }

});

Ext.preg(gxp.plugins.WMTSSource.prototype.ptype, gxp.plugins.WMTSSource);
