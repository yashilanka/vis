/**
 * Created by Alex on 2/10/14.
 */


var graphMixinLoaders = {

  /**
   * Load a mixin into the graph object
   *
   * @param {Object} sourceVariable | this object has to contain functions.
   * @private
   */
  _loadMixin: function (sourceVariable) {
    for (var mixinFunction in sourceVariable) {
      if (sourceVariable.hasOwnProperty(mixinFunction)) {
        Graph.prototype[mixinFunction] = sourceVariable[mixinFunction];
      }
    }
  },


  /**
   * removes a mixin from the graph object.
   *
   * @param {Object} sourceVariable | this object has to contain functions.
   * @private
   */
  _clearMixin: function (sourceVariable) {
    for (var mixinFunction in sourceVariable) {
      if (sourceVariable.hasOwnProperty(mixinFunction)) {
        Graph.prototype[mixinFunction] = undefined;
      }
    }
  },


  /**
   * Mixin the physics system and initialize the parameters required.
   *
   * @private
   */
  _loadPhysicsSystem: function () {
    this._loadMixin(physicsMixin);
    this._loadSelectedForceSolver();
    if (this.constants.configurePhysics == true) {
      this._loadPhysicsConfiguration();
    }
  },


  /**
   * Mixin the cluster system and initialize the parameters required.
   *
   * @private
   */
  _loadClusterSystem: function () {
    this.clusterSession = 0;
    this.hubThreshold = 5;
    this._loadMixin(ClusterMixin);
  },


  /**
   * Mixin the sector system and initialize the parameters required
   *
   * @private
   */
  _loadSectorSystem: function () {
    this.sectors = { },
      this.activeSector = ["default"];
    this.sectors["active"] = { },
      this.sectors["active"]["default"] = {"nodes": {},
        "edges": {},
        "nodeIndices": [],
        "formationScale": 1.0,
        "drawingNode": undefined };
    this.sectors["frozen"] = {},
      this.sectors["support"] = {"nodes": {},
        "edges": {},
        "nodeIndices": [],
        "formationScale": 1.0,
        "drawingNode": undefined };

    this.nodeIndices = this.sectors["active"]["default"]["nodeIndices"];  // the node indices list is used to speed up the computation of the repulsion fields

    this._loadMixin(SectorMixin);
  },


  /**
   * Mixin the selection system and initialize the parameters required
   *
   * @private
   */
  _loadSelectionSystem: function () {
    this.selectionObj = {nodes: {}, edges: {}};

    this._loadMixin(SelectionMixin);
  },


  /**
   * Mixin the navigationUI (User Interface) system and initialize the parameters required
   *
   * @private
   */
  _loadManipulationSystem: function () {
    // reset global variables -- these are used by the selection of nodes and edges.
    this.blockConnectingEdgeSelection = false;
    this.forceAppendSelection = false

    if (this.constants.dataManipulation.enabled == true) {
      // load the manipulator HTML elements. All styling done in css.
      if (this.manipulationDiv === undefined) {
        this.manipulationDiv = document.createElement('div');
        this.manipulationDiv.className = 'graph-manipulationDiv';
        this.manipulationDiv.id = 'graph-manipulationDiv';
        if (this.editMode == true) {
          this.manipulationDiv.style.display = "block";
        }
        else {
          this.manipulationDiv.style.display = "none";
        }
        this.containerElement.insertBefore(this.manipulationDiv, this.frame);
      }

      if (this.editModeDiv === undefined) {
        this.editModeDiv = document.createElement('div');
        this.editModeDiv.className = 'graph-manipulation-editMode';
        this.editModeDiv.id = 'graph-manipulation-editMode';
        if (this.editMode == true) {
          this.editModeDiv.style.display = "none";
        }
        else {
          this.editModeDiv.style.display = "block";
        }
        this.containerElement.insertBefore(this.editModeDiv, this.frame);
      }

      if (this.closeDiv === undefined) {
        this.closeDiv = document.createElement('div');
        this.closeDiv.className = 'graph-manipulation-closeDiv';
        this.closeDiv.id = 'graph-manipulation-closeDiv';
        this.closeDiv.style.display = this.manipulationDiv.style.display;
        this.containerElement.insertBefore(this.closeDiv, this.frame);
      }

      // load the manipulation functions
      this._loadMixin(manipulationMixin);

      // create the manipulator toolbar
      this._createManipulatorBar();
    }
    else {
      if (this.manipulationDiv !== undefined) {
        // removes all the bindings and overloads
        this._createManipulatorBar();
        // remove the manipulation divs
        this.containerElement.removeChild(this.manipulationDiv);
        this.containerElement.removeChild(this.editModeDiv);
        this.containerElement.removeChild(this.closeDiv);

        this.manipulationDiv = undefined;
        this.editModeDiv = undefined;
        this.closeDiv = undefined;
        // remove the mixin functions
        this._clearMixin(manipulationMixin);
      }
    }
  },


  /**
   * Mixin the navigation (User Interface) system and initialize the parameters required
   *
   * @private
   */
  _loadNavigationControls: function () {
    this._loadMixin(NavigationMixin);

    // the clean function removes the button divs, this is done to remove the bindings.
    this._cleanNavigation();
    if (this.constants.navigation.enabled == true) {
      this._loadNavigationElements();
    }
  },


  /**
   * Mixin the hierarchical layout system.
   *
   * @private
   */
  _loadHierarchySystem: function () {
    this._loadMixin(HierarchicalLayoutMixin);
  }

};
