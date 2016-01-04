import React, { PropTypes } from 'react';
import radium from 'radium';
import style from './style';
import { decycle } from 'json-decycle';

class ManifestActionComponent extends React.Component {
    static propTypes = {
        diff: PropTypes.array,
        toggleAction: PropTypes.func,
        index: PropTypes.number,
        action: PropTypes.object,
        skipped: PropTypes.bool,
        expanded: PropTypes.bool,
    };

    constructor() {
        super();
        this.state = {
            expanded: false,
        };
    }

    getDiffs() {
        const { diff } = this.props;

        return diff.map((d, i) => this.renderDiff(d, i));
    }

    expandAction() {
        this.setState({
            expanded: !this.state.expanded,
        });
    }

    disableAction() {
        this.props.toggleAction(this.props.index);
    }

    createOldValue(diff) {
        if (diff.item) {
            return (JSON.stringify(diff.item.lhs, decycle));
        }

        return JSON.stringify(diff.lhs, decycle);
    }

    createNewValue(diff) {
        if (diff.item) {
            return (JSON.stringify(diff.item.rhs, decycle));
        }

        return JSON.stringify(diff.rhs, decycle);
    }

    createPath(diff) {
        let path = [];

        if (diff.path) {
            path = path.concat(diff.path);
        }
        if (typeof(diff.index) !== 'undefined') {
            path.push(diff.index);
        }
        return path.length ? path.join('.') : '';
    }

    renderDiff(diff, index) {
        const oldValue = this.createOldValue(diff);
        const newValue = this.createNewValue(diff);
        const path = this.createPath(diff);

        return (
            <div key={index}>
                { path }: <span style={style.oldValue}>{ oldValue || 'undefined' }</span>
                <span style={style.newValue}> { newValue } </span>
            </div>
        );
    }

    render() {
        const { action: { action }, diff, skipped } = this.props;
        const expanded = this.props.expanded || this.state.expanded;
        const storeHasChanged = !!diff.length;
        const changes = this.getDiffs();

        const actionBlock = this.state.expanded ?
            <div>
                <pre style={style.actionData}>{JSON.stringify(action)}</pre>
            </div> :
            null;

        const storeBlock = (expanded && storeHasChanged) ?
            <div>
                <div style={style.header}>
                    <span>Store Mutations</span>
                </div>
        <pre
            className="diff"
            style={style.store}
        >
          {changes}
        </pre>
            </div> :
            null;

        const enableToggle = skipped ?
            'enable' :
            'disable';

        return (
            <div className="manifest-action-component">
                <div style={style.base}>
                    <div
                        className={action.type}
                        style={[
                            style.title,
                            diff.length && style.mutated,
                            skipped && style.skipped,
                        ]}
                        onClick={this.expandAction.bind(this)}
                    >
                        <span>{action.type}</span>
              <span style={style.toggle} onClick={this.disableAction.bind(this)}>
                {enableToggle}
              </span>
                    </div>
                    {actionBlock}
                    {storeBlock}
                </div>
            </div>
        );
    }
}

export default radium(ManifestActionComponent);
