var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { Control } from 'leaflet';
import PropTypes from 'prop-types';
import React, { cloneElement, Component, Children } from 'react';

import MapControl from './MapControl';
import children from './propTypes/children';
import controlPosition from './propTypes/controlPosition';
import layerContainer from './propTypes/layerContainer';
import map from './propTypes/map';


var baseControlledLayerPropTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
  removeLayer: PropTypes.func,
  removeLayerControl: PropTypes.func
};

var controlledLayerPropTypes = _extends({}, baseControlledLayerPropTypes, {
  addBaseLayer: PropTypes.func,
  addOverlay: PropTypes.func,
  name: PropTypes.string.isRequired
});

// Abtract class for layer container, extended by BaseLayer and Overlay
var ControlledLayer = function (_Component) {
  _inherits(ControlledLayer, _Component);

  function ControlledLayer() {
    _classCallCheck(this, ControlledLayer);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  ControlledLayer.prototype.getChildContext = function getChildContext() {
    return {
      layerContainer: {
        addLayer: this.addLayer.bind(this),
        removeLayer: this.removeLayer.bind(this)
      }
    };
  };

  ControlledLayer.prototype.componentWillReceiveProps = function componentWillReceiveProps(_ref) {
    var checked = _ref.checked;

    // Handle dynamically (un)checking the layer => adding/removing from the map
    if (checked === true && (this.props.checked == null || this.props.checked === false)) {
      this.context.map.addLayer(this.layer);
    } else if (this.props.checked === true && (checked == null || checked === false)) {
      this.context.map.removeLayer(this.layer);
    }
  };

  ControlledLayer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.removeLayerControl(this.layer);
  };

  ControlledLayer.prototype.addLayer = function addLayer() {
    throw new Error('Must be implemented in extending class');
  };

  ControlledLayer.prototype.removeLayer = function removeLayer(layer) {
    this.props.removeLayer(layer);
  };

  ControlledLayer.prototype.render = function render() {
    return this.props.children || null;
  };

  return ControlledLayer;
}(Component);

ControlledLayer.propTypes = baseControlledLayerPropTypes;
ControlledLayer.contextTypes = {
  map: map
};
ControlledLayer.childContextTypes = {
  layerContainer: layerContainer
};

var BaseLayer = function (_ControlledLayer) {
  _inherits(BaseLayer, _ControlledLayer);

  function BaseLayer() {
    _classCallCheck(this, BaseLayer);

    return _possibleConstructorReturn(this, _ControlledLayer.apply(this, arguments));
  }

  BaseLayer.prototype.addLayer = function addLayer(layer) {
    this.layer = layer; // Keep layer reference to handle dynamic changes of props
    var _props = this.props,
        addBaseLayer = _props.addBaseLayer,
        checked = _props.checked,
        name = _props.name;

    addBaseLayer(layer, name, checked);
  };

  return BaseLayer;
}(ControlledLayer);

BaseLayer.propTypes = controlledLayerPropTypes;

var Overlay = function (_ControlledLayer2) {
  _inherits(Overlay, _ControlledLayer2);

  function Overlay() {
    _classCallCheck(this, Overlay);

    return _possibleConstructorReturn(this, _ControlledLayer2.apply(this, arguments));
  }

  Overlay.prototype.addLayer = function addLayer(layer) {
    this.layer = layer; // Keep layer reference to handle dynamic changes of props
    var _props2 = this.props,
        addOverlay = _props2.addOverlay,
        checked = _props2.checked,
        name = _props2.name;

    addOverlay(layer, name, checked);
  };

  return Overlay;
}(ControlledLayer);

Overlay.propTypes = controlledLayerPropTypes;

var LayersControl = function (_MapControl) {
  _inherits(LayersControl, _MapControl);

  function LayersControl() {
    _classCallCheck(this, LayersControl);

    return _possibleConstructorReturn(this, _MapControl.apply(this, arguments));
  }

  LayersControl.prototype.createLeafletElement = function createLeafletElement(props) {
    var _children = props.children,
        options = _objectWithoutProperties(props, ['children']);

    return new Control.Layers(undefined, undefined, options);
  };

  LayersControl.prototype.componentWillMount = function componentWillMount() {
    _MapControl.prototype.componentWillMount.call(this);
    this.controlProps = {
      addBaseLayer: this.addBaseLayer.bind(this),
      addOverlay: this.addOverlay.bind(this),
      removeLayer: this.removeLayer.bind(this),
      removeLayerControl: this.removeLayerControl.bind(this)
    };
  };

  LayersControl.prototype.componentWillUnmount = function componentWillUnmount() {
    var _this5 = this;

    setTimeout(function () {
      _MapControl.prototype.componentWillUnmount.call(_this5);
    }, 0);
  };

  LayersControl.prototype.addBaseLayer = function addBaseLayer(layer, name) {
    var checked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (checked) {
      this.context.map.addLayer(layer);
    }
    this.leafletElement.addBaseLayer(layer, name);
  };

  LayersControl.prototype.addOverlay = function addOverlay(layer, name) {
    var checked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (checked) {
      this.context.map.addLayer(layer);
    }
    this.leafletElement.addOverlay(layer, name);
  };

  LayersControl.prototype.removeLayer = function removeLayer(layer) {
    this.context.map.removeLayer(layer);
  };

  LayersControl.prototype.removeLayerControl = function removeLayerControl(layer) {
    this.leafletElement.removeLayer(layer);
  };

  LayersControl.prototype.render = function render() {
    var _this6 = this;

    var children = Children.map(this.props.children, function (child) {
      return child ? cloneElement(child, _this6.controlProps) : null;
    });
    return React.createElement(
      'div',
      { style: { display: 'none' } },
      children
    );
  };

  return LayersControl;
}(MapControl);

LayersControl.propTypes = {
  baseLayers: PropTypes.object,
  children: children,
  overlays: PropTypes.object,
  position: controlPosition
};
LayersControl.contextTypes = {
  layerContainer: layerContainer,
  map: map
};
export default LayersControl;


LayersControl.BaseLayer = BaseLayer;
LayersControl.Overlay = Overlay;