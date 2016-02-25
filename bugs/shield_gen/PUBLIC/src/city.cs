using System.Linq;
using System.Collections.Generic;

namespace ShieldGen {
	partial class City {
		private int _available_area;
		public int AvailableArea {
			get {return _available_area;}
			set {_available_area = value;}
		}

		private List<Facility> _buildings = new List<Facility>();
		public List<Facility> Buildings() { return _buildings; }

		public int RemainingArea() {
			return AvailableArea - (from b in Buildings()
					select b).Sum(((x) => x.Space));
		}

		public bool add_building(Facility f) {
			if(RemainingArea() < f.Space) return false;
			_buildings.Add(f);
			return true;
		}
	}
}