package com.med.con_export.wrapper;

import com.hashmapinc.tempus.WitsmlObjects.v20.Well;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="WellWrapper")
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WellWrapper {
	private Well well;

	@XmlElement(name="Well")
	public Well getWell() {
		return well;
	}
}
