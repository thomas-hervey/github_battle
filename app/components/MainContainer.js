const React = require('react');
const styles = require('../styles');

function MainContainer (props) {
    return (
        <div className="jumbotron col-sm-2 text-center" style={styles.transparentBg}>
            {props.children}
        </div>
    )
}

module.exports = MainContainer;