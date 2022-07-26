import React from "react";
import '../styles/error_boundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: 'to_be_announced' };
    }

    componentDidCatch(error, info) {
        // Show fallback UI
        this.setState({ hasError: true, message: error })
    }

    render() {
        if(this.state.hasError) {
            return (
                <div className="err-bg">
                    <div className="err-title-box">
                        <h1 className="err-title"> There's an error 🙁</h1>
                    </div>
                    <div className="err-content-box">
                        <p className="err-content-desc">
                            An unexpected error has been thrown. Please restart the app and try again. We are sorry for the inconvenience :(
                        </p>
                    </div>
                    <div className="err-err_info-box">
                        <p className="err-err_info-desc">
                            {`${this.state.message}`}
                        </p>
                    </div>
                </div>
            )
        }
        return this.props.children;
    }

}

export default ErrorBoundary;