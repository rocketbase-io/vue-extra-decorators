import { template } from "lodash";
import { pkg, year, name } from "./package";

const opts = { ...pkg, year, nameFormatted: name };

export default template(`
/**
 * <%= nameFormatted %> (<%= name %> v<%= version %>)
 * <%= description %>
 * <%= homepage %>
 * (c) <%= year %> <%= author %>
 * @license <%= license || "MIT" %>
 */
`)(opts).trim();
