import { View, StyleSheet, Text } from 'react-native';
import barcodes from 'jsbarcode/src/barcodes';
import Svg, { Path } from 'react-native-svg';
import React, { useState, useEffect } from 'react';

var ErrorBoundary = /*@__PURE__*/(function (superclass) {
  function ErrorBoundary(props) {
    superclass.call(this, props);
    this.state = {
      hasError: false
    };
  }

  if ( superclass ) ErrorBoundary.__proto__ = superclass;
  ErrorBoundary.prototype = Object.create( superclass && superclass.prototype );
  ErrorBoundary.prototype.constructor = ErrorBoundary;

  ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError (error) {
    return {
      hasError: true
    };
  };

  ErrorBoundary.prototype.componentDidCatch = function componentDidCatch (error, errorInfo) {
    console.log(error, errorInfo);
  };

  ErrorBoundary.prototype.render = function render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return React.createElement( 'h1', null, "Something went wrong." );
    }

    return this.props.children;
  };

  return ErrorBoundary;
}(React.Component));

var Barcode = function (ref) {
  var value = ref.value;
  var format = ref.format; if ( format === void 0 ) format = 'CODE128';
  var width = ref.width; if ( width === void 0 ) width = 2;
  var height = ref.height; if ( height === void 0 ) height = 100;
  var text = ref.text;
  var textColor = ref.textColor; if ( textColor === void 0 ) textColor = '#000000';
  var lineColor = ref.lineColor; if ( lineColor === void 0 ) lineColor = '#000000';
  var background = ref.background; if ( background === void 0 ) background = '#ffffff';
  var onError = ref.onError;

  var ref$1 = useState([]);
  var bars = ref$1[0];
  var setBars = ref$1[1];
  var ref$2 = useState(0);
  var barCodeWidth = ref$2[0];
  var setBarCodeWidth = ref$2[1];
  var props = {
    value: value,
    format: format,
    width: width,
    height: height,
    text: text,
    textColor: textColor,
    lineColor: lineColor,
    background: background,
    onError: onError
  };
  useEffect(function () {
    update();
  }, [value]);

  var update = function () {
    var encoder = barcodes[format];
    var encoded = encode(value, encoder, props);

    if (format.substr(0, "EAN".length) === "EAN") {
      encoded = encoded.reduce(function (p, n) { return ({
        data: ("" + (p.data) + (n.data || '')),
        text: ("" + (p.text) + (n.text || ''))
      }); }, {
        data: '',
        text: ''
      });
    }

    if (encoded) {
      setBars(drawSvgBarCode(encoded, props));
      setBarCodeWidth(encoded.data.length * width);
    }
  };

  var drawSvgBarCode = function (encoding, options) {
    var rects = []; // binary data of barcode

    var binary = encoding.data;
    var barWidth = 0;
    var x = 0;
    var yFrom = 0;

    for (var b = 0; b < binary.length; b++) {
      x = b * options.width;

      if (binary[b] === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = drawRect(x - options.width * barWidth, yFrom, options.width * barWidth, options.height);
        barWidth = 0;
      }
    } // Last draw is needed since the barcode ends with 1


    if (barWidth > 0) {
      rects[rects.length] = drawRect(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height);
    }

    return rects;
  };

  var drawRect = function (x, y, width, height) {
    return ("M" + x + "," + y + "h" + width + "v" + height + "h-" + width + "z");
  }; // encode() handles the Encoder call and builds the binary string to be rendered


  var encode = function (text, Encoder, options) {
    // If text is not a non-empty string, throw error.
    if (typeof text !== 'string' || text.length === 0) {
      if (options.onError) {
        options.onError(new Error('Barcode value must be a non-empty string'));
        return;
      }

      throw new Error('Barcode value must be a non-empty string');
    }

    var encoder;

    try {
      encoder = new Encoder(text, options);
    } catch (error) {
      // If the encoder could not be instantiated, throw error.
      if (options.onError) {
        options.onError(new Error('Invalid barcode format.'));
        return;
      }

      throw new Error('Invalid barcode format.');
    } // If the input is not valid for the encoder, throw error.


    if (!encoder.valid()) {
      if (options.onError) {
        options.onError(new Error('Invalid barcode for selected format.'));
        return;
      }

      throw new Error('Invalid barcode for selected format.');
    } // Make a request for the binary data (and other infromation) that should be rendered
    // encoded stucture is {
    //  text: 'xxxxx',
    //  data: '110100100001....'
    // }


    var encoded = encoder.encode();
    return encoded;
  };

  var backgroundStyle = {
    backgroundColor: background
  };
  return React.createElement( ErrorBoundary, null,
      React.createElement( View, { style: [styles.svgContainer, backgroundStyle] },
        React.createElement( Svg, { height: height, width: barCodeWidth, fill: lineColor },
          React.createElement( Path, { d: bars.join(' ') })
        ),
        typeof text !== 'undefined' && React.createElement( Text, { style: {
        color: textColor,
        width: barCodeWidth,
        textAlign: 'center'
      } },
            text
          )
      )
    );
};

var styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    padding: 10
  }
});

export default Barcode;
//# sourceMappingURL=index.mjs.map
