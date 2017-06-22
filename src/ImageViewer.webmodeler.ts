import { Component, DOM, createElement } from "react";
import { ImageViewer, ImageViewerProps } from "./components/ImageViewer";
import ImageViewerContainer, { ImageViewerContainerProps } from "./components/ImageViewerContainer";
import { Alert } from "./components/Alert";

// tslint:disable-next-line
const image = require("base64-image-loader!./img/Preview.jpg");

declare function require(name: string): string;

type VisibilityMap = {
    [P in keyof ImageViewerContainerProps]: boolean;
};

// tslint:disable-next-line:class-name
export class preview extends Component<ImageViewerContainerProps, {}> {

    render() {
        return DOM.div({},
            createElement(ImageViewer, this.transformProps(this.props)),
            createElement(Alert, { message: ImageViewerContainer.validateProps(this.props) })
        );
    }

    private transformProps(props: ImageViewerContainerProps): ImageViewerProps {
        return {
            className: props.class,
            height: props.height,
            heightUnit: props.heightUnit,
            imageUrl: this.getImage(props),
            responsive: props.responsive,
            style: ImageViewerContainer.parseStyle(props.style),
            width: props.width,
            widthUnit: props.widthUnit
        };
    }

    private getImage(props: ImageViewerContainerProps): string {
        if (props.source === "staticUrl") {
            return props.urlStatic;
        } else if (props.source === "staticImage") {
            return props.imageStatic;
        }

        return image;
    }
}

export function getPreviewCss() {
    return require("./ui/ImageViewer.css");
}

export function getVisibleProperties(valueMap: ImageViewerContainerProps, visibilityMap: VisibilityMap) {
    if (valueMap.source === "systemImage") {
        visibilityMap.dynamicUrlAttribute = false;
        visibilityMap.urlStatic = false;
        visibilityMap.imageStatic = false;
    } else if (valueMap.source === "urlAttribute") {
        visibilityMap.dynamicUrlAttribute = true;
        visibilityMap.urlStatic = false;
        visibilityMap.imageStatic = false;
    } else if (valueMap.source === "staticUrl") {
        visibilityMap.dynamicUrlAttribute = false;
        visibilityMap.urlStatic = true;
        visibilityMap.imageStatic = false;
    } else if (valueMap.source === "staticImage") {
        visibilityMap.dynamicUrlAttribute = false;
        visibilityMap.urlStatic = false;
        visibilityMap.imageStatic = true;
    }
    if (valueMap.widthUnit === "auto") {
        visibilityMap.width = false;
    } else if (valueMap.heightUnit === "auto") {
        visibilityMap.height = false;
    }

    return visibilityMap;
}
