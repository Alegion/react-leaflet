var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { Popup as LeafletPopup } from 'leaflet';
import PropTypes from 'prop-types';

import DivOverlay from './DivOverlay';
import latlng from './propTypes/latlng';
import layer from './propTypes/layer';
import map from './propTypes/map';

var Popup = function (_DivOverlay) {
  _inherits(Popup, _DivOverlay);

  function Popup() {
    var _temp, _this, _ret;

    _classCallCheck(this, Popup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _DivOverlay.call.apply(_DivOverlay, [this].concat(args))), _this), _this.onPopupOpen = function (_ref) {
      var popup = _ref.popup;

      if (popup === _this.leafletElement) {
        _this.onOpen();
      }
    }, _this.onPopupClose = function (_ref2) {
      var popup = _ref2.popup;

      if (popup === _this.leafletElement) {
        _this.onClose();
      }
    }, _this.onRender = function () {
      if (_this.props.autoPan !== false && _this.leafletElement.isOpen()) {
        if (_this.leafletElement._map && _this.leafletElement._map._panAnim) {
          _this.leafletElement._map._panAnim = undefined;
        }
        _this.leafletElement._adjustPan();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Popup.prototype.getOptions = function getOptions(props) {
    return _extends({}, _DivOverlay.prototype.getOptions.call(this, props), {
      autoPan: false
    });
  };

  Popup.prototype.createLeafletElement = function createLeafletElement(props) {
    return new LeafletPopup(this.getOptions(props), this.context.popupContainer || props.popupContainer);
  };

  Popup.prototype.updateLeafletElement = function updateLeafletElement(fromProps, toProps) {
    if (toProps.position !== fromProps.position) {
      this.leafletElement.setLatLng(toProps.position);
    }
  };

  Popup.prototype.componentWillMount = function componentWillMount() {
    _DivOverlay.prototype.componentWillMount.call(this);
    this.leafletElement = this.createLeafletElement(this.props);
    this.leafletElement.options.autoPan = this.props.autoPan !== false;

    this.context.map.on({
      popupopen: this.onPopupOpen,
      popupclose: this.onPopupClose
    });
  };

  Popup.prototype.componentDidMount = function componentDidMount() {
    var position = this.props.position;
    var map = this.context.map;

    var el = this.leafletElement;
    var popupContainer = this.context.popupContainer || this.props.popupContainer;

    if (popupContainer) {
      // Attach to container component
      popupContainer.bindPopup(el);
    } else {
      // Attach to a Map
      if (position) {
        el.setLatLng(position);
      }
      el.openOn(map);
    }
  };

  Popup.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeContent();

    this.context.map.off({
      popupopen: this.onPopupOpen,
      popupclose: this.onPopupClose
    });
    this.context.map.removeLayer(this.leafletElement);

    _DivOverlay.prototype.componentWillUnmount.call(this);
  };

  return Popup;
}(DivOverlay);

Popup.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  position: latlng,
  popupContainer: layer
};
Popup.contextTypes = {
  map: map,
  popupContainer: layer,
  pane: PropTypes.string
};
Popup.defaultProps = {
  pane: 'popupPane'
};
export default Popup;